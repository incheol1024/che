/*
 * Copyright (c) 2015-2017 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 */
'use strict';
import {CheErrorMessagesService} from './che-error-messages.service';

interface IErrorMessagesScope extends ng.IScope{
  namespace: string;
  messageName: string;
}

/**
 * todo
 *
 * @author Oleksii Kurinnyi
 */
export class CheErrorMessages {
  restrict: string = 'E';
  replace: boolean = true;

  scope: {
    [paramName: string]: string;
  };

  cheErrorMessagesService: CheErrorMessagesService;

  /**
   * Default constructor that is using resource injection
   * @ngInject for Dependency injection
   */
  constructor(cheErrorMessagesService: CheErrorMessagesService) {
    this.cheErrorMessagesService = cheErrorMessagesService;

    this.scope = {
      namespace: '@cheNamespace',
      messageName: '@cheMessageName'
    };
  }

  link($scope: IErrorMessagesScope, $element: ng.IAugmentedJQuery) {
    $scope.$watch(() => { return $element.find('[ng-message]').length; }, (messNumber: number) => {
      if (angular.isDefined(messNumber)) {
        this.cheErrorMessagesService.removeMessages($scope.namespace, $scope.messageName);
        angular.element($element.find('[ng-message]')).each((index: number, el: Element) => {
          this.cheErrorMessagesService.addMessage($scope.namespace, $scope.messageName, angular.element(el).text());
        });
      }
    });
  }
}
