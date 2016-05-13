app.factory('AppService', ['$http', '$location', '$rootScope', '$q', '$window', '$timeout',
  function ($http, $location, $rootScope, $q, $window, $timeout) {

    var _members = JSON.parse($window.localStorage.getItem("members"));

    return {
      addItem: function (id, data) {
        if (id) {
          var defer = $q.defer();
          var member = _members[id - 1];
          member.spent.push(data);
          member.total = member.total + data.amount;
          localStorage.setItem("members", JSON.stringify(_members));
          defer.resolve({data: member, message: 'Added successfully ..', status: 200});
          return defer.promise;
        } else {
          defer.resolve({data: data, message: 'could not add', status: 500});
          return defer.reject;
        }
      },
      removeItem: function (id, data) {
        if(id){
          var defer = $q.defer();
          var member = _members[id - 1];
          member.total = member.total - data.amount;
          for(var i=0; i<member.spent.length; ++i){
            if(data == member.spent[i]){
              member.spent.splice(i, 1);
            }
          }
          localStorage.setItem("members", JSON.stringify(_members));
          defer.resolve({data: member, message: 'Deleted successfully ..', status: 200});
          return defer.promise;
        }else{
          defer.resolve({data: data, message: 'could not delete', status: 500});
          return defer.reject;
        }
      },
      addMember: function (data) {
        var id = null;
        var defer = $q.defer();

        if (_members && _members.length > 0) {
          id = _members[_members.length -1].id + 1;
          data.id = id;
          console.log(id);
          _members.push(data);
          $window.localStorage.setItem("members", JSON.stringify(_members));
        } else {
          id = 1;
          data.id = id;
          _members = [];
          _members.push(data);
          $window.localStorage.setItem("members", JSON.stringify(_members));
        }

        if (id) {
          defer.resolve({data: data, message: 'added successfully', status: 200});
          return defer.promise;
        } else {
          defer.resolve({data: data, message: 'could not add', status: 500});
          return defer.reject;
        }
      },
      removeMember: function () {

      },
      getMembers: function () {
        return _members;
      },
      getMember: function (id) {
        return _members[id - 1];
      },
      reset: function(){
        $window.localStorage.removeItem("members");
        _members = [];
      }
    }
  }
]);
