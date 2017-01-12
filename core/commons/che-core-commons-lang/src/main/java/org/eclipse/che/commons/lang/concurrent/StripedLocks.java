/*******************************************************************************
 * Copyright (c) 2012-2017 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 *******************************************************************************/
package org.eclipse.che.commons.lang.concurrent;

import com.google.common.util.concurrent.Striped;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;

/**
 * Helper class to use striped locks in try-with-resources construction.
 * </p>
 * Examples of usage:
 * <pre>{@code
 *  StripedLocks stripedLocks = new StripedLocks(16);
 *  try (CloseableLock lock = stripedLocks.writeLock(myKey)) {
 *      syncedObject.write();
 *  }
 *
 *  try (CloseableLock lock = stripedLocks.readLock(myKey)) {
 *      syncedObject.read();
 *  }
 *
 *  try (CloseableLock lock = stripedLocks.writeAllLock(myKey)) {
 *      for (ObjectToSync objectToSync : allObjectsToSync) {
 *          objectToSync.write();
 *      }
 *  }
 * }</pre>
 *
 * @author Alexander Garagatyi
 * @author Sergii Leschenko
 * @author Yevhenii Voevodin
 */
public class StripedLocks {

    private final Striped<ReadWriteLock> striped;

    public StripedLocks(int stripesCount) {
        striped = Striped.readWriteLock(stripesCount);
    }

    /**
     * Acquire read lock for provided key.
     */
    public UnLocker readLock(String key) {
        Lock lock = striped.get(key).readLock();
        lock.lock();
        return new LockUnLocker(lock);
    }

    /**
     * Acquire write lock for provided key.
     */
    public UnLocker writeLock(String key) {
        Lock lock = striped.get(key).writeLock();
        lock.lock();
        return new LockUnLocker(lock);
    }

    /**
     * Acquire write lock for all possible keys.
     */
    public UnLocker writeAllLock() {
        Lock[] locks = getAllWriteLocks();
        for (Lock lock : locks) {
            lock.lock();
        }
        return new LocksUnLocker(locks);
    }

    private Lock[] getAllWriteLocks() {
        Lock[] locks = new Lock[striped.size()];
        for (int i = 0; i < striped.size(); i++) {
            locks[i] = striped.getAt(i).writeLock();
        }
        return locks;
    }

    private static class LockUnLocker implements UnLocker {

        private final Lock lock;

        private LockUnLocker(Lock lock) {
            this.lock = lock;
        }

        @Override
        public void unlock() {
            lock.unlock();
        }
    }

    private static class LocksUnLocker implements UnLocker {

        private final Lock[] locks;

        private LocksUnLocker(Lock[] locks) {
            this.locks = locks;
        }

        @Override
        public void unlock() {
            for (Lock lock : locks) {
                lock.unlock();
            }
        }
    }
}
