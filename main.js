(function (window, $, db) {
    //bbdbtest("test-div").html("this is another test div!");
    //bbdbtest("test-div2").html("this is, yet, another test div!");

    //Backbone.sync = function (method, model, success, error) {
    //    success();
    //};

    var 
        document = window.document,


        // Item Model
        Item = Backbone.Model.extend({
            defaults: {
                part1: "Hello",
                part2: "world!"
            },

            sync: function(method, model, options) {
                if (method === 'create') {
                    adodb('Driver=SQLite3 ODBC Driver;Database=bb.db;')
                        .execute(
                            "insert into bbtest(part1, part2) values('"
                            + this.get("part1") + "','" + this.get('part2')
                            + "')");
                }
            }
        }),


        // Item Collection
        List = Backbone.Collection.extend({
            model: Item,

            fetch: function () {
                this.set(adodb('Driver=SQLite3 ODBC Driver;Database=bb.db;')
                    .execute('select * from bbtest'));
            }
        }),


        // Item View
        ItemView = Backbone.View.extend({
            tagName: "li",

            events: {
                "click span.swap": "swap",
                "click span.delete": "remove"
            },
            
            initialize: function () {
                _.bindAll(this, "render", "unrender", "swap", "remove");

                this.model.bind("change", this.render);
                this.model.bind("remove", this.unrender);
            },

            render: function () {
                $(this.el).html(
                    '<span>' + this.model.id + ' ' + this.model.get('part1') + ' '
                    + this.model.get('part2') + '</span> &nbsp; &nbsp; '
                    + '<span class="swap" style="font-family:sans-serif; '
                    + 'color:blue; cursor:pointer;">[swap]</span> '
                    + '<span class="delete" style="cursor:pointer; color:red; '
                    + 'font-family:sans-serif;">[delete]</span>'
                );
                return this;
            },

            unrender: function () {
                $(this.el).remove();
            },

            swap: function () {
                var swapped = {
                    part1: this.model.get('part2'),
                    part2: this.model.get('part1')
                };
                this.model.set(swapped);
            },

            remove: function () {
                this.model.destroy();
                //alert("we live");
            }
        }),


        // Item List (collection) View
        ListView = Backbone.View.extend({
            el: $("#test-div2"),

            events: {
                "click button#add": "addItem",
                "click button#refresh": "render"
            },

            initialize: function () {
                _.bindAll(this, "render", "addItem", "appendItem");

                this.collection = new List();
                this.collection.bind("add", this.appendItem);

                this.counter = 0;
                this.render();
            },

            //template: _.template($("#test-template").html()),

            render: function () {

                var self = this;
                $(this.el).html("");
                $(this.el).append("<button id='add'>Add list item</button>"
                    + "<button id='refresh'>refresh list</button>");
                $(this.el).append("<ul></ul>");
                this.collection.fetch();
                //_(this.collection.models).each(function (item) {
                //   self.appendItem(item);
                //}, this);
            },

            addItem: function () {
                this.counter++;

                var item = new Item();
                item.set({
                    part2: item.get("part2") + this.counter
                });
                //this.collection.add(item);
                this.collection.create(item);
            },

            appendItem: function (item) {
                var itemView = new ItemView({
                    model: item
                });

                $("ul", this.el).append(itemView.render().el);
            }
        }),

        listView = new ListView();


})(window, jQuery, adodb);