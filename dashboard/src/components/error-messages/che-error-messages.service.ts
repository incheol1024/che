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

/**
 * todo
 *
 * @author Oleksii Kurinnyi
 */
export class CheErrorMessagesService {
  messages: {
    [namespace: string]: {
      [messageName: string]: string[];
    }
  } = {};

  getMessages(namespace: string): string[] {
    if (!this.messages[namespace]) {
      return [];
    }

    let messages = [];
    Object.keys(this.messages[namespace]).forEach((messageName: string) => {
      messages.push(messageName + ': ' + this.messages[namespace][messageName]);
    });
    return messages;
  }

  addMessage(namespace: string, messageName: string, message: string): void {
    if (!this.messages[namespace]) {
      this.messages[namespace] = {};
    }
    if (!this.messages[namespace][messageName]) {
      this.messages[namespace][messageName] = [];
    }

    if (this.messages[namespace][messageName].indexOf(message) === -1) {
      this.messages[namespace][messageName].push(message);
    }
  }

  removeMessages(namespace: string, messageName: string): void {
    if (this.messages[namespace] && this.messages[namespace][messageName]) {
      this.messages[namespace][messageName] = [];
    }
  }
}
