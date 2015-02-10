(function (global) {

    var
        _adodb = global.adodb,

        adodb = function(cnnStr) {
            return new adodb_(cnnStr);
        },

        adodb_ = function (cnnStr) {

            this.cnn = new ActiveXObject('ADODB.Connection');
            this.cnn.ConnectionString = cnnStr;

            this.execute = function (query) {
                try {
                    this.cnn.Open();
                    var cmd = new ActiveXObject('ADODB.Command');
                    cmd.ActiveConnection = this.cnn;
                    cmd.CommandText = query;
                    var rs = cmd.Execute();

                    var recordObjects = [];
                    if (rs.State != 0) {
                        if (!rs.EOF) {
                            rs.MoveFirst();
                            while (!rs.EOF) {
                                var rec = {}
                                for (var i = 0; i < rs.Fields.Count; i++) {
                                    rec[rs.Fields(i).Name] = rs.Fields(i).Value;
                                }
                                recordObjects.push(rec);
                                rs.MoveNext();
                            }
                        }

                        rs.Close();
                    }
                    this.cnn.Close();
                    return recordObjects;

                } catch(e) {
                    alert(e.lineNumber + ' ' + e.name + ' ' + e.message);
                }
            };
        };

        global.adodb = adodb;

})(window);