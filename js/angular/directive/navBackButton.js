/**
 * @ngdoc directive
 * @name ionNavBackButton
 * @module ionic
 * @restrict E
 * @parent ionNavBar
 * @description
 * Creates a back button inside an {@link ionic.directive:ionNavBar}.
 *
 * Will show up when the user is able to go back in the current navigation stack.
 *
 * By default, will go back when clicked.  If you wish for more advanced behavior, see the
 * examples below.
 *
 * @usage
 *
 * With default click action:
 *
 * ```html
 * <ion-nav-bar>
 *   <ion-nav-back-button class="button-icon">
 *     <i class="ion-arrow-left-c"></i> Back!
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 *
 * With custom click action, using {@link ionic.service:$ionicNavBarDelegate}:
 *
 * ```html
 * <ion-nav-bar ng-controller="MyCtrl">
 *   <ion-nav-back-button class="button-icon"
 *     ng-click="canGoBack && goBack()">
 *     <i class="ion-arrow-left-c"></i> Back
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicNavBarDelegate) {
 *   $scope.goBack = function() {
 *     $ionicNavBarDelegate.back();
 *   };
 * }
 * ```
 *
 * Displaying the previous title on the back button, again using
 * {@link ionic.service:$ionicNavBarDelegate}.
 *
 * ```html
 * <ion-nav-bar ng-controller="MyCtrl">
 *   <ion-nav-back-button class="button button-icon ion-arrow-left-c">
 *     {% raw %}{{getPreviousTitle() || 'Back'}}{% endraw %}
 *   </ion-nav-back-button>
 * </ion-nav-bar>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicNavBarDelegate) {
 *   $scope.getPreviousTitle = function() {
 *     return $ionicNavBarDelegate.getPreviousTitle();
 *   };
 * }
 * ```
 */
IonicModule
.directive('ionNavBackButton', [
  '$animate',
function($animate) {
  return {
    restrict: 'E',
    require: '^ionNavBar',
    compile: function(tElement, tAttrs) {
      tElement.addClass('button back-button ng-hide');
      return function($scope, $element, $attr, navBarCtrl) {
        if (!$attr.ngClick) {
          $scope.$navBack = navBarCtrl.back;
          $element.on('click', function(event){
            $scope.$apply(function() {
              $scope.$navBack(event);
            });
          });
        }

        //If the current viewstate does not allow a back button,
        //always hide it.
        var deregisterListener = $scope.$parent.$on(
          '$viewHistory.historyChange',
          function(e, data) {
            $scope.hasBackButton = !!data.showBack;
          }
        );
        $scope.$on('$destroy', deregisterListener);

        //Make sure both that a backButton is allowed in the first place,
        //and that it is shown by the current view.
        $scope.$watch('!!(backButtonShown && hasBackButton)', ionic.animationFrameThrottle(function(show) {
          if (show) $animate.removeClass($element, 'ng-hide');
          else $animate.addClass($element, 'ng-hide');
        }));
      };
    }
  };
}]);
