window.onload = function(){

  var Stamp = (function(){

    //return closure
	   return function(){

  // Create a storage object for the prototype properties that will go into
  // instance, this will be stored so each instance POINTS to the same object
	var proto = {};

  // as opposte to the prototype object storage, we need a function because
  // each instance properties is unique to the instance
  var instanceProps = function(){

      return{};

  };

  // main function object that carries the APIs and gets returned by closure
	function maker(delegateProperties, ownProperties){

    maker.init(ownProperties);
    maker.delegate(delegateProperties);

    return maker.create();

  }

  // sets delegate props that will go into the prototype
  maker.delegate = function setDelegateProps(props){

    proto = (props)? props : proto;

    return this;

  };

  // sets instance own properties, pass in a closure to create privacy.
  maker.init = function setOwnProps(ownProps){

    instanceProps =  ownProps? ownProps : instanceProps;

  	return this;

  };

  // creates the object instance after instance own properties
  // and delegate properties have been set.
  maker.create = function createObject(){

    // Create the instance Object and have its prototype point the set stamp prototype
  	var exportObject = Object.create(proto);

            //merge in instane properties and return instance of stamp.
    return Object.assign(exportObject, instanceProps());

  };

  //utility function to merge proptotype properties and own properties from ancestors
  function mergeProps(parents){

    var mergedProps = {
        private: {},
        prototype: {}
    };

    //iterate through arguments and inherit props from each instance object
    for(var parent in parents){

      if(parents.hasOwnProperty(parent)){

        // generate an instance of the current parent we are inheriting from
        // to capture own properties and delegate properties and merge them.
        var instance = parents[parent].create();

        //merge in prototype properties from parents
        Object.assign(mergedProps.prototype, Object.getPrototypeOf(instance));
        //merge in own properties from parents
        Object.assign(mergedProps.private, instance);

      }

    }

    //return both private and public props
    return mergedProps;

  }

  // allows inheritance of two stamps, hierarchy is determined from left to right.
  maker.inherit = function(){

    var stamps = arguments;

        //set own properties for this stamp
        this.init(function(){

          return mergeProps(stamps).private;

        });

        //set delegate object that will generate the prototype for this stamp
        this.delegate(mergeProps(stamps).prototype);

        return this;

  }

      //return the factory function.
      return maker;

  };

})();

window.Stamp = Stamp;


};
