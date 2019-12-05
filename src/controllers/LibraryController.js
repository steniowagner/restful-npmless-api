const Library = require('../models/Library');
const User = require('../models/User');

const getLibraryInstance = async () => {
  const [library] = await Library.findAll({});

  if (library) {
    return library;
  }

  const libraryId = await Library.create({
    bookCollection: [],
    borrowedBooks: [],
    waitingQueue: [],
  });

  return {
    bookCollection: [],
    borrowedBooks: [],
    waitingQueue: [],
    id: libraryId,
  };
};

const handleInsertUserWaitingQueue = async ({
  waitingQueue,
  libraryId,
  bookId,
  userId,
}) => {
  if (!waitingQueue.length) {
    await Library.findOneAndUpdate(libraryId, {
      waitingQueue: [{
        queue: [userId],
        book: bookId,
      }],
    });

    return 1;
  }

  const waitingQueueItemIndex = waitingQueue
    .findIndex(waitingQueueItem => waitingQueueItem.book === bookId);

  if (waitingQueueItemIndex < 0) {
    await Library.findOneAndUpdate(libraryId, {
      waitingQueue: [...waitingQueue, {
        queue: [userId],
        book: bookId,
      }],
    });

    return 1;
  }

  const { queue } = waitingQueue[waitingQueueItemIndex];

  await Library.findOneAndUpdate(libraryId, {
    waitingQueue: Object.assign(waitingQueue, {
      [waitingQueueItemIndex]: {
        queue: [...queue, userId],
        book: bookId,
      },
    }),
  });

  return queue.length + 1;
};

const checkIsUserNextWaitingQueue = (waitingQueue, userId, bookId) => {
  const waitingQueueItem = waitingQueue.find(({ book }) => book === bookId);

  if (!waitingQueueItem) {
    return true;
  }

  return waitingQueueItem.queue[0] === userId;
};

const checkIsBorrowBookPayloadParamsValids = payload => {
  const { deliveryDate, bookId } = payload;
  const isMissingParams = !deliveryDate || !bookId;
  const isParamsWrongType = [deliveryDate, bookId].some(item => typeof item !== 'string');

  let paramErrorMessage = '';

  if (isMissingParams) {
    paramErrorMessage = 'are required';
  }

  if (isParamsWrongType) {
    paramErrorMessage = 'must be strings';
  }

  return paramErrorMessage;
};

const updateUserHistory = async ({
  deliveryDate,
  borrowDate,
  userId,
  bookId,
}) => {
  const { history } = await User.findOne(userId);

  await User.findOneAndUpdate(userId, {
    history: [...history, {
      book: bookId,
      deliveryDate,
      borrowDate,
    }],
  });
};

const handleBorrowBookSuccess = async (libraryInstance, bookIndex, req) => {
  const {
    bookCollection,
    borrowedBooks,
    waitingQueue,
    id,
  } = libraryInstance;

  const { deliveryDate, bookId } = req.payload;
  const { user_id } = req.headers;

  const isUserNextWaitingQueue = checkIsUserNextWaitingQueue(waitingQueue, user_id, bookId);

  const waitingQueueUpdated = (isUserNextWaitingQueue && waitingQueue.length)
    ? waitingQueue.slice(1) : waitingQueue;

    const bookCollectionUpdated = Object.assign(bookCollection, {
    [bookIndex]: {
      ...bookCollection[bookIndex],
      availableQuantity: bookCollection[bookIndex].availableQuantity - 1,
    },
  });

  const rawBorrowDate = new Date().toLocaleString();
  const [borrowDate] = rawBorrowDate.split(',');

  const borrowedBooksUpdated = [...borrowedBooks, {
    user: user_id,
    book: bookId,
    deliveryDate,
    borrowDate,
  }];

  await Library.findOneAndUpdate(id, {
    bookCollection: bookCollectionUpdated,
    borrowedBooks: borrowedBooksUpdated,
    waitingQueue: waitingQueueUpdated,
  });

  await updateUserHistory({
    userId: user_id,
    deliveryDate,
    borrowDate,
    bookId,
  });
};

exports.read = async (_, res) => {
  const { id } = await getLibraryInstance();

  const library = await Library.findOne(id);

  return res.send().status(200).data({ library });
};

exports.addNewBook = async (req, res) => {
  try {
    const { bookCollection, id } = await getLibraryInstance();
    const { quantity } = req.payload;
    const { bookId } = req.locals;

    await Library.findOneAndUpdate(id, {
      bookCollection: [...bookCollection, {
        availableQuantity: quantity,
        totalQuantity: quantity,
        book: bookId,
      }],
    });

    return res.send().status(200).data({ id: bookId });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.removeBook = async (req, res) => {
  try {
    const { bookCollection, id } = await getLibraryInstance();
    const { id: bookId } = req.params;

    await Library.findOneAndUpdate(id, {
      bookCollection: bookCollection.filter(({ book }) => book !== bookId),
    });

    return res.send().status(200).data({});
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.borrowBook = async (req, res) => {
  try {
    const payloadParamsErrorMessage = checkIsBorrowBookPayloadParamsValids(req.payload);

    if (payloadParamsErrorMessage) {
      return res.send().status(400).data({
        error: `The params borrowDate, deliveryDate and bookId ${payloadParamsErrorMessage}.`,
      });
    }

    const libraryInstance = await getLibraryInstance();

    const { bookCollection, waitingQueue, id } = libraryInstance;
    const { user_id } = req.headers;
    const { bookId } = req.payload;

    const bookIndex = bookCollection
      .findIndex(bookCollectionItem => bookCollectionItem.book === bookId);

    if (!bookCollection[bookIndex]) {
      return res.send().status(404).data({
        error: 'Book not found.',
      });
    }

    const isUserNextWaitingQueue = checkIsUserNextWaitingQueue(waitingQueue, user_id, bookId);
    const { availableQuantity } = bookCollection[bookIndex];
    const isBookAvailableUserNotNext = availableQuantity && !isUserNextWaitingQueue;

    if (!availableQuantity || isBookAvailableUserNotNext) {
      const userPositionWaitingQueue = await handleInsertUserWaitingQueue({
        userId: user_id,
        libraryId: id,
        waitingQueue,
        bookId,
      });

      return res.send().status(201).data({
        message: `Book not available. The user is the number ${userPositionWaitingQueue} on the Waiting Queue for this book.`,
      });
    }

    await handleBorrowBookSuccess(libraryInstance, bookIndex, req);

    return res.send().status(201).data({
      message: 'Book borrowed successfully.',
    });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.deliverBook = async (req, res) => {
  try {
    const { user_id } = req.headers;
    const { bookId } = req.payload;

    if (!bookId) {
      return res.send().status(400).data({
        error: 'You must specify the book that you\'re delivering.',
      });
    }

    const {
      bookCollection,
      borrowedBooks,
      waitingQueue,
      id,
    } = await getLibraryInstance();

    const bookCollectionUpdated = bookCollection.map(bookCollectionItem => {
      if (bookCollectionItem.book === bookId) {
        return {
          ...bookCollectionItem,
          availableQuantity: bookCollectionItem.availableQuantity + 1,
        }
      }
    });

    const borrowedBooksUpdated = borrowedBooks.filter(borrowedBooksItem => {
      if (borrowedBooksItem.user !== user_id && borrowedBooksItem.book !== bookId) {
        return borrowedBooksItem;
      }
    });

    let waitingQueueUpdated = waitingQueue;

    const bookWaitingQueueIndex =
      waitingQueue.findIndex(waitingQueueItem => waitingQueueItem.book === bookId);

    if (bookWaitingQueueIndex >= 0) {
      const [nextUser, ...queueUpdated] = waitingQueue[bookWaitingQueueIndex].queue;

      console.log(`\n>>> Send message to user ${nextUser} and say that the book is available!\n`);

      waitingQueueUpdated = Object.assign(waitingQueue, {
        [bookWaitingQueueIndex]: {
          ...waitingQueue[bookWaitingQueueIndex],
          queue: queueUpdated,
        }
      })
    }

    await Library.findOneAndUpdate(id, {
      bookCollection: bookCollectionUpdated,
      borrowedBooks: borrowedBooksUpdated,
      waitingQueue: waitingQueueUpdated,
    });

    return res.send().status(201).data({
      message: 'Book delivered successfully.',
    });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};
