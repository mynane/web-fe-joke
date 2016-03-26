define(function () {
    calendarApp.controller("ModalPrompt", function ($scope) {
        $scope.promptSubmit = function(){
            $scope.$emit("prompt-submit");
            $scope.closeModal();
        }
        $scope.promptCancel = function(){
            $scope.$emit("prompt-cancel");
            $scope.closeModal();
        }
    });
});
