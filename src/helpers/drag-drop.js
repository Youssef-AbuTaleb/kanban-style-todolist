export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const move = (sourceList, destList, source, destination) => {
  const sourceClone = Array.from(sourceList);
  const destClone = Array.from(destList);

  const [removed] = sourceClone.splice(source.index, 1);

  destClone.splice(destination.index, 0, {
    ...removed,
    status: destination.droppableId,
  });

  return {
    source: sourceClone,
    destination: destClone,
  };
};
