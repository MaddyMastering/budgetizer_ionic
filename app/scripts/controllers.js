var app = angular.module('starter.controllers', []);

app.controller('AppCtrl', function ($scope, $ionicModal, $timeout, AppService) {

  function final_sketch(giver, extra){
    while (extra.length > 0 && giver.length > 0) {
      var temp = extra[0].extra - giver[0].toGive;
      console.log('extra ', extra[0]);
      console.log('giver ', giver[0]);

      if (temp > 0) {
        $scope.budgetList.push(giver[0].name + ' should give ' + giver[0].toGive + 'rs to ' + extra[0].name);
        extra[0].extra = extra[0].extra - giver[0].toGive;
        giver[0].toGive = 0;
        giver.shift();
      } else if(temp < 0){
        $scope.budgetList.push(giver[0].name + ' should give ' + giver[0].toGive + 'rs to ' + extra[0].name);
        var x = parseInt(temp.toString().replace(/\-/g, ''));
        giver[0].toGive = temp;
        extra.shift();
      }else if(temp == 0){
        $scope.budgetList.push(giver[0].name + ' should give ' + giver[0].toGive + 'rs to ' + extra[0].name);
        giver[0].toGive = 0;
        extra.shift();
        giver.shift();
      }
    }
  }

  function _find_total(team) {
    $scope.budget = 0;
    $scope.budgetList = [];
    for (var i = 0; i < team.length; ++i) {
      $scope.budget += team[i].total;
    }

    $scope.budget = Math.round(($scope.budget / team.length) * 100) / 100;

    var extra = [], giver = [];
    for (var i = 0; i < team.length; i++) {
      console.log(team[i].name + ' spent ' + team[i].total);

      var temp = team[i].total - $scope.budget;
      if (temp < 0) {
        team[i].toGive = parseInt(temp.toString().replace(/\-/g, ''));
        team[i].donor = true;
        giver.push(team[i]);
      } else if(temp > 0){
        team[i].extra = temp;
        extra.push(team[i]);
      }
    }

    $scope.giver = angular.copy(giver);
    $scope.extra = angular.copy(extra);

    final_sketch(giver, extra);
  }

  $ionicModal.fromTemplateUrl('templates/estimate.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/reset.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.resetModal = modal;
  });

  $scope.estimateModalOpen = function () {
    $scope.modal.show();
    _find_total(AppService.getMembers());
  };

  $scope.resetModalOpen = function () {
    $scope.resetModal.show();
  };

  $scope.reset = function () {
    AppService.reset();
    $scope.closeModal();
    $state.go('app.home');
  };

  $scope.closeModal = function () {
    $scope.resetModal.hide();
    $scope.modal.hide();
    $scope.$broadcast('update');
  };

});

app.controller('HomeCtrl', function ($scope, AppService) {
  console.log('home ctrl init');

  $scope.$on('update', function (e) {
    $scope.memberList = AppService.getMembers();
  });

  $scope.memberList = AppService.getMembers();
});

app.controller('AddMemberCtrl', function ($scope, $ionicPopup, AppService) {
  console.log('add member ctrl init ..');

  $scope.member = {name: '', spent: [], total: 0, donor: false, extra: 0, toGive: 0};

  function addMember(data) {
    AppService.addMember(data).then(function (data) {
      console.log('added member ', data);
      if (data.status == 200) {
        $scope.member = {name: '', spent: [], total: 0, donor: false, extra: 0, toGive: 0};
        $ionicPopup.alert({title: 'Add Member', template: data.message});
      }
    }, function (error) {
      console.error(error);
    })
  }

  $scope._addMember = function () {
    addMember($scope.member);
  };
});

app.controller('AddItemCtrl', function ($scope, $ionicHistory, $stateParams, AppService) {
  console.log('add item ctrl with id :' + $stateParams.id);
  $scope.member = AppService.getMember($stateParams.id);

  $scope.item = {purpose: '', amount: '', date: ''};

  function addItem(data) {
    AppService.addItem($stateParams.id, data).then(function (data) {
      console.log(data);
      if (data.status == 200) {
        $scope.item = {purpose: '', amount: '', date: ''};
        $ionicHistory.goBack();
      }
    }, function (error) {
      console.error(error);
    });
  }

  $scope._addItem = function () {
    $scope.item.date = new Date();
    addItem($scope.item);
  };
});

app.controller('MemberCtrl', function ($scope, $stateParams, $ionicModal, AppService) {
  console.log('member ctrl init with id :' + $stateParams.id);
  $scope.member = AppService.getMember($stateParams.id);

  $scope._delete = function(data){
    AppService.removeItem($stateParams.id, data).then(function (data) {
      if (data.status == 200) {
        console.log(data);
      }
    }, function (error) {
      console.log(error);
    });
  };

  $ionicModal.fromTemplateUrl('templates/item_details.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(data){
    $scope.modalData = data;
    $scope.modal.show();
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
  };
});
