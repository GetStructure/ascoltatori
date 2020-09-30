var steed = require('steed')();

describeAscoltatore("AMQP", function() {
  afterEach(function() {
    this.instance.close();
    this.instance.on("error", function () {
      console.log(arguments);
      // we should just close it,
      // avoid errors
    });
  });

  it("should publish a binary payload", function(done) {
    var that = this;
    that.instance.sub("hello/*", function(topic, value) {
      expect(value).to.eql(new Buffer([248]));
      done();
    }, function() {
      that.instance.pub("hello/123", new Buffer([248]));
    });
  });

  it("should sync two instances", function(done) {
    var other = new ascoltatori.AMQPAscoltatore(this.instance._opts);
    var that = this;
    steed.series([

      function(cb) {
        other.on("ready", cb);
      },

      function(cb) {
        that.instance.subscribe("hello", wrap(done), cb);
      },

      function(cb) {
        other.publish("hello", null, cb);
      }
    ]);
  });
});
