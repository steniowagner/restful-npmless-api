const getPathValue = require('./getPathValue');

const getFieldsToMerge = ({ root, pathsToMerge, maxDepth, fieldsToMerge, depth = 0 }) => {
  if (depth === maxDepth) {
    return fieldsToMerge;
  }

  fieldsToMerge.push(root[pathsToMerge[depth]]);

  const nextDepth = depth + 1;
  const nextRoot = root[pathsToMerge[nextDepth]];

  getFieldsToMerge({
    depth: nextDepth,
    root: nextRoot,
    fieldsToMerge,
    pathsToMerge,
    maxDepth,
  });
};

const mergeFields = (pathsToMerge, fieldsToMerge, parentUpdated) => {
  fieldsToMerge.reverse();
  pathsToMerge.reverse();

  const mergedFields = pathsToMerge.reduce((accumulator, _, index) => {
    if (index === 0) {
      return {
        [pathsToMerge[0]]: parentUpdated
      }
    }

    return {
      [pathsToMerge[index]]: {
        ...fieldsToMerge[index],
        ...accumulator
      }
    }
  }, {});

  return mergedFields;
};

const updatedInputWithMergedFields = ({
  fieldsToMerge,
  parentUpdated,
  pathsToMerge,
  object,
  paths,
}) => {
  const mergedFields = mergeFields(pathsToMerge, fieldsToMerge, parentUpdated);

  const objectUpdated = {
    ...object,
    [paths[0]]: {
      ...object[paths[0]],
      ...mergedFields,
    }
  };

  return objectUpdated;
};

const getParentUpdated = (paths, object, value) => {
  const nearestParentPath = paths.slice(0, paths.length - 1).join('.');

  const parentUpdated = {
    ...getPathValue(nearestParentPath, object),
    [paths[paths.length - 1]]: value,
  };

  return parentUpdated;
};

const setPathValue = (path, object, value) => {
  const paths = path.split('.');
  const fieldsToMerge = [];

  if (paths.length === 1) {
    return {
      ...object,
      [paths[0]]: value,
    }
  }

  const parentUpdated = getParentUpdated(paths, object, value);
  const pathsToMerge = paths.slice(1, paths.length - 1);

  getFieldsToMerge({
    maxDepth: pathsToMerge.length,
    root: object[paths[0]],
    fieldsToMerge,
    pathsToMerge,
  });

  if (!fieldsToMerge.length) {
    return {
      ...object,
      [paths[0]]: parentUpdated,
    };
  }

  return updatedInputWithMergedFields({
    fieldsToMerge,
    parentUpdated,
    pathsToMerge,
    object,
    paths,
  });
};

module.exports = setPathValue;
