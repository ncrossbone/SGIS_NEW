var inspector;

/* GRAPH */

var graph = new joint.dia.Graph({ type: 'bpmn' }).on({

    // this is happening before the view of the model is actually added into the paper
    'add': function(cell, collection, opt) {

        var type = cell.get('type');

        // Set a low z-index on pools and groups so they always stay under all other elements.
        var z = { 'bpmn.Pool': -3, 'bpmn.Group': -2, 'bpmn.Flow': -1 }[type];
        if (z) cell.set('z', z, { silent: true });

        if (!opt.stencil) return;

        // some types of the elements need resizing after they are dropped
        var x = { 'bpmn.Pool': 5, 'bpmn.Choreography': 2 }[type];

        if (x) {
            var size = cell.get('size');
            cell.set('size', {
                width: size.width * x,
                height: size.height * x
            }, { silent: true });
        }
    }

});

var commandManager = new joint.dia.CommandManager({ graph: this.graph });

/* PAPER + SCROLLER */

var paper = new joint.dia.Paper({
    width: 2000,
    height: 2000,
    model: graph,
    gridSize: 10,
    model: graph,
    perpendicularLinks: true,
    defaultLink: new joint.shapes.bpmn.Flow,
    validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {

        // don't allow loop links
        if (cellViewS == cellViewT) return false;

        var view = (end === 'target' ? cellViewT : cellViewS);

        // don't allow link to link connection
        if (view instanceof joint.dia.LinkView) return false;

        return true;
    }

}).on({

    'blank:pointerdown': function(evt,x,y) {

        if (_.contains(KeyboardJS.activeKeys(), 'shift')) {
            selectionView.startSelecting(evt, x, y);
        } else {
            selectionView.cancelSelection();
            paperScroller.startPanning(evt, x, y);
        }
    },

    'cell:pointerdown': function(cellView, evt) {

        // Select an element if CTRL/Meta key is pressed while the element is clicked.
        if ((evt.ctrlKey || evt.metaKey) && cellView.model instanceof joint.dia.Element) {
            selection.add(cellView.model);
            selectionView.createSelectionBox(cellView);
        }

        var cell = cellView.model;

        if (cell.get('parent')) {
            graph.getCell(cell.get('parent')).unembed(cell);
        }
    },

    'cell:pointerup': function(cellView) {

        embedInPool(cellView.model);
        openIHF(cellView);
    }

});

var paperScroller = new joint.ui.PaperScroller({
    autoResizePaper: true,
    padding: 50,
    paper: paper
});

paperScroller.$el.appendTo('#paper-container');

paperScroller.center();

/* SELECTION */

var selection = (new Backbone.Collection).on({

    'reset': function(cells, opt) {

        if (opt.safe) return;

        // don't allow any pool to be selected by area selection
        var pools = cells.filter(function(cell) {
            return (cell instanceof joint.shapes.bpmn.Pool);
        });

        if (!_.isEmpty(pools)) {

            cells.reset(cells.without.apply(cells, pools), { safe: true });

            _.chain(pools).map(paper.findViewByModel, paper).filter()
                .map(selectionView.destroySelectionBox, selectionView);
        }
    }
});

var selectionView = new joint.ui.SelectionView({
    paper: paper,
    graph: graph,
    model: selection
}).on({
    'selection-box:pointerdown': function(evt) {
        // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
        if (evt.ctrlKey || evt.metaKey) {
            var cell = selection.get($(evt.target).data('model'));
            selection.reset(selection.without(cell));
            selectionView.destroySelectionBox(paper.findViewByModel(cell));
        }
    }
});

/* STENCIL */

var stencil = new joint.ui.Stencil({ graph: graph, paper: paper });

stencil.render().$el.appendTo('#stencil-container');

stencil.load([
    new joint.shapes.bpmn.Gateway,
    new joint.shapes.bpmn.Activity,
    new joint.shapes.bpmn.Event,
    new joint.shapes.bpmn.Annotation,
    // a groups and pools can't be connected with any other elements
    new joint.shapes.bpmn.Pool({
        attrs: {
            '.': { magnet: false },
            '.header': { fill: '#5799DA' }
        },
        lanes: { label: 'Pool' }
    }),
    new joint.shapes.bpmn.Group({
        attrs: {
            '.': { magnet: false },
            '.label': { text: 'Group' }
        }
    }),
    new joint.shapes.bpmn.Conversation,
    new joint.shapes.bpmn.Choreography({
        participants: ['Participant 1', 'Participant 2']
    }),
    new joint.shapes.bpmn.Message,
    new joint.shapes.bpmn.DataObject
]);

joint.layout.GridLayout.layout(stencil.getGraph(), {
    columns: 100,
    columnWidth: 110,
    rowHeight: 110,
    dy: 20,
    dx: 20,
    resizeToFit: true
});

stencil.getPaper().fitToContent(0, 0, 10);

// Create tooltips for all the shapes in stencil.
stencil.getGraph().get('cells').each(function(cell) {
    new joint.ui.Tooltip({
        target: '.stencil [model-id="' + cell.id + '"]',
        content: cell.get('type').split('.')[1],
        bottom: '.stencil',
        direction: 'bottom',
        padding: 0
    });
});

/* CELL ADDED: after the view of the model was added into the paper */
graph.on('add', function(cell, collection, opt) {

    // TODO: embedding after an element is dropped from the stencil. There is a problem with
    // the command manager and wrong order of actions (embeding, parenting, adding and as it
    // must be 3,1,2) in one batch. Can't be done silently either (becoming an attribute
    // of an element being added) because redo action of `add` (=remove) won't reset the parent embeds.
    // --embedInPool(cell);

    if (!opt.stencil) return;
    
    // open inspector after a new element dropped from stencil
    var view = paper.findViewByModel(cell);
    if (view) openIHF(view);
});

/* KEYBOARD */

KeyboardJS.on('delete, backspace', function(evt) {

    if (!$.contains(evt.target, paper.el)) return;

    commandManager.initBatchCommand();
    selection.invoke('remove');
    commandManager.storeBatchCommand();
    selectionView.cancelSelection();
});

// Disable context menu inside the paper.

// This prevents from context menu being shown when selecting individual elements with Ctrl in OS X.
paper.el.oncontextmenu = function(evt) { evt.preventDefault(); };


$('#toolbar-container [data-tooltip]').each(function() {

    new joint.ui.Tooltip({
        target: $(this),
        content: $(this).data('tooltip'),
        top: '#toolbar-container',
        direction: 'top'
    });
});

function openIHF(cellView) {
        // No need to re-render inspector if the cellView didn't change.
        if (!inspector || inspector.options.cellView !== cellView) {

            if (inspector) {
                // Clean up the old inspector if there was one.
                inspector.remove();
            }

            var type = cellView.model.get('type');

            inspector = new joint.ui.Inspector({
                cellView: cellView,
                inputs: inputs[type],
                groups: {
                    general: { label: type, index: 1 },
                    appearance: { index: 2 }
                }
            });

            $('#inspector-container').prepend(inspector.render().el);
        }

        if (cellView.model instanceof joint.dia.Element && !selection.contains(cellView.model)) {

            new joint.ui.FreeTransform({ cellView: cellView }).render();

            new joint.ui.Halo({
                cellView: cellView,
                boxContent: function(cellView) {
                    return cellView.model.get('type');
                }
            }).render();

            selectionView.cancelSelection();
            selection.reset([cellView.model], { safe: true });
        }
}

function embedInPool(cell) {

    if (cell instanceof joint.dia.Link) return;

    var cellsBelow = graph.findModelsInArea(cell.getBBox());

    if (!_.isEmpty(cellsBelow)) {
        // Note that the findViewsFromPoint() returns the view for the `cell` itself.
        var cellBelow = _.find(cellsBelow, function(c) {
            return (c instanceof joint.shapes.bpmn.Pool) && (c.id !== cell.id);
        });

        // Prevent recursive embedding.
        if (cellBelow && cellBelow.get('parent') !== cell.id) {
            cellBelow.embed(cell);
        }
    }
}

function showStatus(message, type) {

    $('.status').removeClass('info error success').addClass(type).html(message);
    $('#statusbar-container').dequeue().addClass('active').delay(3000).queue(function() {
        $(this).removeClass('active');
    });
};

var toolbar = {

    toJSON: function() {

        var windowFeatures = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no';
            var windowName = _.uniqueId('json_output');
            var jsonWindow = window.open('', windowName, windowFeatures);

        jsonWindow.document.write(JSON.stringify(graph.toJSON()));
    },

    loadGraph: function() {

        gd_auth(function() {

            showStatus('loading..', 'info');
            gd_load(function(name, content) {
                try {
                    var json = JSON.parse(content);
                    graph.fromJSON(json);
                    document.getElementById('fileName').value = name.replace(/.json$/, '');
                    showStatus('loaded.', 'success');
                } catch (e) {
                    showStatus('failed.', 'error');
                }
            });

        }, true);
    },

    saveGraph: function() {

        gd_auth(function() {

            showStatus('saving..', 'info');
            var name = document.getElementById('fileName').value;
            gd_save(name, JSON.stringify(graph.toJSON()), function(file) {

                if (file) {
                    showStatus('saved.', 'success');
                } else {
                    showStatus('failed.', 'error');
                }
            });

        }, true);
    }
};

// an example graph
//graph.fromJSON({"cells":[{"type":"bpmn.Flow","flowType":"normal","id":"b86ee66a-b628-4883-8975-a21d80547c5a","embeds":"","source":{"id":"30b45d57-a9fb-4d8e-bc6c-9cbd27344b76"},"target":{"id":"8daae8a2-ae07-4a33-99a2-498d90e9dbeb"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"f3a8a4eb-0c07-4807-8190-a5d29b2bc4f0","embeds":"","source":{"id":"f06e2e0c-43b8-4ce4-8b03-3441bd696228"},"target":{"id":"ad273d3d-d093-4d09-8e4a-fcbd20e78a8c"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"4b1e80c2-f2bf-4eb2-82b5-de64a680f063","embeds":"","source":{"id":"5f20a0f6-f60f-4b9f-a67e-aabf3c57200b"},"target":{"id":"b2797827-0135-4c4d-8958-4b8bcd7144e9"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"49056d0d-20f8-4487-8e34-38e2bd103790","embeds":"","source":{"id":"b2797827-0135-4c4d-8958-4b8bcd7144e9"},"target":{"id":"9aabf30d-7f53-4d16-a374-d2362d000f94"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"49fb9204-bb6e-40c1-8aec-70bdeef07cee","embeds":"","source":{"id":"9aabf30d-7f53-4d16-a374-d2362d000f94"},"target":{"id":"de4bbbaf-650f-4250-8ac4-4f1de5cdafe1"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"08adac7d-f375-41ec-8187-7cb1f2e419b0","embeds":"","source":{"id":"de4bbbaf-650f-4250-8ac4-4f1de5cdafe1"},"target":{"id":"f06e2e0c-43b8-4ce4-8b03-3441bd696228"},"z":-1,"vertices":[{"x":930,"y":1240}],"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"0772f53d-393d-4bdc-b5a9-538c1b60d384","embeds":"","source":{"id":"de4bbbaf-650f-4250-8ac4-4f1de5cdafe1"},"target":{"id":"30b45d57-a9fb-4d8e-bc6c-9cbd27344b76"},"z":-1,"vertices":[{"x":930,"y":760}],"attrs":{}},{"type":"bpmn.Flow","flowType":"association","id":"2d1e8d65-012b-4978-ad93-ecb8f55a39cd","embeds":"","source":{"id":"10d9bf17-3222-4554-9e1c-46c21edc6b51"},"target":{"id":"de4bbbaf-650f-4250-8ac4-4f1de5cdafe1"},"z":-1,"attrs":{".marker-target":{"d":"M 0 0"},".connection":{"stroke-dasharray":"4,4"}}},{"type":"bpmn.Flow","flowType":"association","id":"3ca33ae0-1932-4ff0-a0c9-bf6500b1ae19","embeds":"","source":{"id":"bc57e168-a433-4f4b-afbf-1313f6e1085c"},"target":{"id":"de4bbbaf-650f-4250-8ac4-4f1de5cdafe1"},"z":-1,"attrs":{".marker-target":{"d":"M 0 0"},".connection":{"stroke-dasharray":"4,4"}}},{"type":"bpmn.Flow","flowType":"message","id":"4f2ca158-15ed-4d46-8c1b-ca587b310a87","embeds":"","source":{"id":"77736108-a7ae-4986-8c4e-3ed09bf38c1c"},"target":{"id":"b2797827-0135-4c4d-8958-4b8bcd7144e9"},"z":-1,"attrs":{".marker-target":{"fill":"#FFF"},".connection":{"stroke-dasharray":"4,4"}}},{"type":"bpmn.Flow","flowType":"message","id":"505827c2-011f-40ff-b260-b7e093728a94","embeds":"","source":{"id":"f14459a2-5158-41bb-90ac-4e49bf059500"},"target":{"id":"b2797827-0135-4c4d-8958-4b8bcd7144e9"},"z":-1,"attrs":{".marker-target":{"fill":"#FFF"},".connection":{"stroke-dasharray":"4,4"}}},{"type":"bpmn.Flow","flowType":"association","id":"4239fe86-4721-4443-a3f2-e45f64a3bfd6","embeds":"","source":{"id":"993e6828-acdd-4f90-b7b8-67cf4bc7dd17"},"target":{"id":"ad273d3d-d093-4d09-8e4a-fcbd20e78a8c"},"z":-1,"attrs":{".marker-target":{"d":"M 0 0"},".connection":{"stroke-dasharray":"4,4"}}},{"type":"bpmn.Choreography","size":{"width":140,"height":140},"participants":["Seller","Auction House"],"initiatingParticipant":"Seller","content":"publish auction","position":{"x":430,"y":940},"angle":0,"id":"b2797827-0135-4c4d-8958-4b8bcd7144e9","embeds":"","z":1,"subProcess":false,"attrs":{".participant-rect":{"fill":"#d8d8d8"},".sub-process":{"visibility":"hidden","data-sub-process":""},".fobj":{"width":140,"height":140},"div":{"style":{"width":140,"height":140},"html":"publish auction"}}},{"type":"bpmn.Choreography","size":{"width":140,"height":140},"participants":["Potential Buyer","Auction House"],"initiatingParticipant":"Potential Buyer","content":"place offer","position":{"x":650.0000000000001,"y":940},"angle":0,"id":"9aabf30d-7f53-4d16-a374-d2362d000f94","embeds":"","z":2,"subProcess":false,"attrs":{".participant-rect":{"fill":"#d8d8d8"},".sub-process":{"visibility":"hidden","data-sub-process":""},".fobj":{"width":140,"height":140},"div":{"style":{"width":140,"height":140},"html":"place offer"}}},{"type":"bpmn.Choreography","size":{"width":140,"height":140},"participants":["Seller","Buyer","Auction House"],"initiatingParticipant":"Auction House","content":"purchase process","position":{"x":1080,"y":700},"angle":0,"id":"30b45d57-a9fb-4d8e-bc6c-9cbd27344b76","embeds":"","z":3,"subProcess":true,"attrs":{".participant-rect":{"fill":"#d8d8d8"},".sub-process":{"visibility":"visible","data-sub-process":true},".fobj":{"width":140,"height":140},"div":{"style":{"width":140,"height":140},"html":"purchase process"}}},{"type":"bpmn.Choreography","size":{"width":140,"height":140},"participants":["Seller","Auction House"],"initiatingParticipant":"Seller","content":"Inform about product being not sold","position":{"x":1080,"y":1160},"angle":0,"id":"f06e2e0c-43b8-4ce4-8b03-3441bd696228","embeds":"","z":4,"subProcess":false,"attrs":{".participant-rect":{"fill":"#d8d8d8"},".sub-process":{"visibility":"hidden","data-sub-process":""},".fobj":{"width":140,"height":140},"div":{"style":{"width":140,"height":140},"html":"Inform about product being not sold"}}},{"type":"bpmn.Event","size":{"width":70,"height":70},"eventType":"start","position":{"x":230,"y":980},"angle":0,"id":"5f20a0f6-f60f-4b9f-a67e-aabf3c57200b","embeds":"","z":5,"icon":"none","attrs":{".inner":{"visibility":"hidden"}}},{"type":"bpmn.Event","size":{"width":70,"height":70},"eventType":"end","position":{"x":1340,"y":720},"angle":0,"id":"8daae8a2-ae07-4a33-99a2-498d90e9dbeb","embeds":"","z":6,"icon":"none","attrs":{".outer":{"stroke-width":5},".inner":{"visibility":"hidden"}}},{"type":"bpmn.Event","size":{"width":70,"height":70},"eventType":"end","position":{"x":1330,"y":1200},"angle":0,"id":"ad273d3d-d093-4d09-8e4a-fcbd20e78a8c","embeds":"","z":7,"icon":"none","attrs":{".outer":{"stroke-width":5},".inner":{"visibility":"hidden"}}},{"type":"bpmn.Gateway","size":{"width":70,"height":70},"position":{"x":900,"y":970},"angle":0,"id":"de4bbbaf-650f-4250-8ac4-4f1de5cdafe1","embeds":"","z":8,"icon":"cross","attrs":{"image":{"xlink:href":"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0yMi4yNDUsNC4wMTVjMC4zMTMsMC4zMTMsMC4zMTMsMC44MjYsMCwxLjEzOWwtNi4yNzYsNi4yN2MtMC4zMTMsMC4zMTItMC4zMTMsMC44MjYsMCwxLjE0bDYuMjczLDYuMjcyICBjMC4zMTMsMC4zMTMsMC4zMTMsMC44MjYsMCwxLjE0bC0yLjI4NSwyLjI3N2MtMC4zMTQsMC4zMTItMC44MjgsMC4zMTItMS4xNDIsMGwtNi4yNzEtNi4yNzFjLTAuMzEzLTAuMzEzLTAuODI4LTAuMzEzLTEuMTQxLDAgIGwtNi4yNzYsNi4yNjdjLTAuMzEzLDAuMzEzLTAuODI4LDAuMzEzLTEuMTQxLDBsLTIuMjgyLTIuMjhjLTAuMzEzLTAuMzEzLTAuMzEzLTAuODI2LDAtMS4xNGw2LjI3OC02LjI2OSAgYzAuMzEzLTAuMzEyLDAuMzEzLTAuODI2LDAtMS4xNEwxLjcwOSw1LjE0N2MtMC4zMTQtMC4zMTMtMC4zMTQtMC44MjcsMC0xLjE0bDIuMjg0LTIuMjc4QzQuMzA4LDEuNDE3LDQuODIxLDEuNDE3LDUuMTM1LDEuNzMgIEwxMS40MDUsOGMwLjMxNCwwLjMxNCwwLjgyOCwwLjMxNCwxLjE0MSwwLjAwMWw2LjI3Ni02LjI2N2MwLjMxMi0wLjMxMiwwLjgyNi0wLjMxMiwxLjE0MSwwTDIyLjI0NSw0LjAxNXoiLz48L3N2Zz4="}}},{"size":{"width":70,"height":70},"type":"bpmn.Annotation","wingLength":20,"content":"Product not sold","position":{"x":830,"y":1150},"angle":0,"id":"10d9bf17-3222-4554-9e1c-46c21edc6b51","embeds":"","z":9,"attrs":{"rect":{"fill-opacity":"0.1"},".stroke":{"d":"M 20 0 L 0 0 0 70 20 70"},".fobj":{"width":70,"height":70},"div":{"style":{"width":70,"height":70},"html":"Product not sold"}}},{"size":{"width":70,"height":70},"type":"bpmn.Annotation","wingLength":20,"content":"Product sold","position":{"x":830,"y":810},"angle":0,"id":"bc57e168-a433-4f4b-afbf-1313f6e1085c","embeds":"","z":10,"attrs":{"rect":{"fill-opacity":"0.1"},".stroke":{"d":"M 20 0 L 0 0 0 70 20 70"},".fobj":{"width":70,"height":70},"div":{"style":{"width":70,"height":70},"html":"Product sold"}}},{"type":"bpmn.Message","size":{"width":70,"height":46.66666666666667},"position":{"x":470,"y":780},"angle":0,"id":"77736108-a7ae-4986-8c4e-3ed09bf38c1c","embeds":"","z":11,"attrs":{".label":{"text":"product information"}}},{"type":"bpmn.Message","size":{"width":70,"height":46.66666666666667},"position":{"x":460,"y":1190},"angle":0,"id":"f14459a2-5158-41bb-90ac-4e49bf059500","embeds":"","z":12,"attrs":{".body":{"fill":"#d8d8d8"},".label":{"text":"auction no."}}},{"size":{"width":190,"height":80},"type":"bpmn.Annotation","wingLength":20,"content":"This example\nis taken from\nbpmn-community.org","position":{"x":1450,"y":1190},"angle":0,"id":"993e6828-acdd-4f90-b7b8-67cf4bc7dd17","embeds":"","z":13,"attrs":{".stroke":{"d":"M 20 0 L 0 0 0 80 20 80"},".fobj":{"width":190,"height":80},"div":{"style":{"width":190,"height":80},"html":"This example\nis taken from\nbpmn-community.org"}}}]});
graph.fromJSON({"type":"bpmn","cells":[{"type":"bpmn.Group","size":{"width":140,"height":270},"position":{"x":550,"y":900},"angle":0,"id":"7f76be46-08b7-4ffb-baa6-2deb96158db2","embeds":"","z":-2,"attrs":{".label":{"text":"Group"},".":{"magnet":false}}},{"type":"bpmn.Flow","flowType":"normal","id":"cca440ad-a2d8-4d9f-aed3-1ed728c7acea","embeds":"","source":{"id":"e401cd68-e2a5-4dad-937f-9cabdca88405"},"target":{"id":"9027d474-5175-4ed9-8cde-79d853195d7d"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"8b029952-01f2-492b-a835-86d8e30f6746","embeds":"","source":{"id":"9027d474-5175-4ed9-8cde-79d853195d7d"},"target":{"id":"fa17964e-bf11-45ae-a084-374a13aa3ceb"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"0dc70d4a-0725-4169-8e20-f887579caf3c","embeds":"","source":{"id":"9027d474-5175-4ed9-8cde-79d853195d7d"},"target":{"id":"2b1cd8f6-032a-479e-979c-4f3bb9f7024c"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"52f84345-9081-437f-ac2c-bcd932ff4dfd","embeds":"","source":{"id":"fa17964e-bf11-45ae-a084-374a13aa3ceb"},"target":{"id":"19652696-fef6-4fb5-ace3-ae3450ebbe08"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"4c474567-95e5-4835-8045-2417c483937e","embeds":"","source":{"id":"2b1cd8f6-032a-479e-979c-4f3bb9f7024c"},"target":{"x":780,"y":1040},"z":-1,"attrs":{}},{"type":"bpmn.Choreography","size":{"width":140,"height":186.66666666666669},"participants":["Participant 1","Participant 2"],"initiatingParticipant":0,"content":"","position":{"x":930,"y":910},"angle":0,"id":"6f53fb1d-8b58-40cb-9178-97d9cb22bc03","embeds":"","z":-1,"attrs":{".sub-process":{"visibility":"hidden","data-sub-process":""},".fobj":{"width":140,"height":186.66666666666669},"div":{"style":{"width":140,"height":186.66666666666669},"html":""}}},{"type":"bpmn.Flow","flowType":"normal","id":"7670b492-9d5b-4268-9032-d05d07fb0225","embeds":"","source":{"id":"6f53fb1d-8b58-40cb-9178-97d9cb22bc03"},"target":{"id":"985738dd-38ce-4100-8fe7-4800c27120d0"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"7e556efa-98a9-43e0-ab88-0eea1cb8dc7f","embeds":"","source":{"id":"985738dd-38ce-4100-8fe7-4800c27120d0"},"target":{"id":"1b815d50-197f-44a7-b980-c4ba23a281ec"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"ad2e2f43-0e20-44b2-9d5b-429d0c862c05","embeds":"","source":{"id":"1b815d50-197f-44a7-b980-c4ba23a281ec"},"target":{"id":"83362bc2-c5cf-43f3-be43-d6622717f51b"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"a309dbd1-cd8e-4d2b-ae7e-9860afbd82b4","embeds":"","source":{"id":"1fea608e-0257-44a7-b7e1-bc45fd79262b"},"target":{"id":"83362bc2-c5cf-43f3-be43-d6622717f51b"},"z":-1,"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"b6e020fd-0cc0-4cfb-afee-b94463aecc02","embeds":"","source":{"id":"985738dd-38ce-4100-8fe7-4800c27120d0"},"target":{"x":1360,"y":1110},"z":-1,"vertices":[{"x":1260,"y":1040}],"attrs":{}},{"type":"bpmn.Flow","flowType":"normal","id":"e78e596c-85fc-44b9-969b-666e1707abdb","embeds":"","source":{"id":"19652696-fef6-4fb5-ace3-ae3450ebbe08"},"target":{"id":"6f53fb1d-8b58-40cb-9178-97d9cb22bc03"},"z":-1,"attrs":{}},{"type":"bpmn.Event","size":{"width":70,"height":70},"eventType":"start","position":{"x":490,"y":1340},"angle":0,"id":"b32bf90f-1250-49f8-84f9-e6df7dde697f","embeds":"","z":1,"attrs":{".inner":{"visibility":"hidden"}}},{"type":"bpmn.Event","size":{"width":70,"height":70},"eventType":"start","position":{"x":240,"y":970},"angle":0,"id":"e401cd68-e2a5-4dad-937f-9cabdca88405","embeds":"","z":2,"attrs":{".inner":{"visibility":"hidden"}}},{"size":{"width":70,"height":70},"type":"bpmn.Activity","activityType":"task","subProcess":null,"content":"","position":{"x":580,"y":1070},"angle":0,"id":"2b1cd8f6-032a-479e-979c-4f3bb9f7024c","embeds":"","z":3,"attrs":{".inner":{"visibility":"hidden"},"path":{"ref":".outer"},"image":{"ref":".outer","ref-dy":"","ref-y":5,"xlink:href":""},"text":{"ref-y":0.5},".fobj":{"width":70,"height":70},"div":{"style":{"width":70,"height":70},"html":""},".fobj div":{"style":{"verticalAlign":"middle","paddingTop":0}},".outer":{"stroke-width":1,"stroke-dasharray":"none"},".sub-process":{"visibility":"hidden","data-sub-process":""}}},{"size":{"width":70,"height":70},"type":"bpmn.Activity","activityType":"task","subProcess":null,"content":"","position":{"x":580,"y":930},"angle":0,"id":"fa17964e-bf11-45ae-a084-374a13aa3ceb","embeds":"","z":4,"attrs":{".inner":{"visibility":"hidden"},"path":{"ref":".outer"},"image":{"ref":".outer","ref-dy":"","ref-y":5,"xlink:href":""},"text":{"ref-y":0.5},".fobj":{"width":70,"height":70},"div":{"style":{"width":70,"height":70},"html":""},".fobj div":{"style":{"verticalAlign":"middle","paddingTop":0}},".outer":{"stroke-width":1,"stroke-dasharray":"none"},".sub-process":{"visibility":"hidden","data-sub-process":""}}},{"type":"bpmn.Gateway","size":{"width":70,"height":70},"position":{"x":390,"y":990},"angle":0,"id":"9027d474-5175-4ed9-8cde-79d853195d7d","embeds":"","z":5,"attrs":{}},{"type":"bpmn.Conversation","size":{"width":70,"height":70},"conversationType":"conversation","position":{"x":780,"y":980},"angle":0,"id":"19652696-fef6-4fb5-ace3-ae3450ebbe08","embeds":"","z":6,"attrs":{"polygon":{"stroke-width":1},".sub-process":{"visibility":"hidden","data-sub-process":""}}},{"size":{"width":70,"height":70},"type":"bpmn.Annotation","wingLength":20,"content":"","position":{"x":940,"y":780},"angle":0,"id":"dd8e88ed-1157-48f1-8582-c5b4684958e5","embeds":"","z":8,"attrs":{".stroke":{"d":"M 20 0 L 0 0 0 70 20 70"},".fobj":{"width":70,"height":70},"div":{"style":{"width":70,"height":70},"html":""}}},{"size":{"width":70,"height":70},"type":"bpmn.Annotation","wingLength":20,"content":"","position":{"x":920,"y":1150},"angle":0,"id":"3de912c2-b5ff-477e-aff9-09244f8060b7","embeds":"","z":9,"attrs":{".stroke":{"d":"M 20 0 L 0 0 0 70 20 70"},".fobj":{"width":70,"height":70},"div":{"style":{"width":70,"height":70},"html":""}}},{"type":"bpmn.Message","size":{"width":70,"height":46.66666666666667},"position":{"x":1380,"y":900},"angle":0,"id":"1b815d50-197f-44a7-b980-c4ba23a281ec","embeds":"","z":10,"attrs":{}},{"type":"bpmn.DataObject","size":{"width":70,"height":93.33333333333334},"position":{"x":1360,"y":1060},"angle":0,"id":"1fea608e-0257-44a7-b7e1-bc45fd79262b","embeds":"","z":11,"attrs":{}},{"type":"bpmn.Conversation","size":{"width":70,"height":70},"conversationType":"conversation","position":{"x":1140,"y":970},"angle":0,"id":"985738dd-38ce-4100-8fe7-4800c27120d0","embeds":"","z":12,"attrs":{"polygon":{"stroke-width":1},".sub-process":{"visibility":"hidden","data-sub-process":""}}},{"type":"bpmn.Event","size":{"width":70,"height":70},"eventType":"start","position":{"x":1540,"y":1030},"angle":0,"id":"83362bc2-c5cf-43f3-be43-d6622717f51b","embeds":"","z":13,"attrs":{".inner":{"visibility":"hidden"}}}]});