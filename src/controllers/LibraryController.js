const Library = require('../models/Library');

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

  const newLibraryInstance = await Library.findOne(libraryId);

  return newLibraryInstance;
};

exports.addNewBook = async (req, res) => {
  try {
    const { bookCollection, id } = await getLibraryInstance();
    const { bookId } = req.locals;

    await Library.findOneAndUpdate(id, {
      bookCollection: [...bookCollection, bookId],
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
      bookCollection: bookCollection.filter(book => book !== bookId),
    });

    return res.send().status(200).data({});
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};
