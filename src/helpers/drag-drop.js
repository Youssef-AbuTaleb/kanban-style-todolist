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
    column: destination.droppableId,
  });

  return {
    source: sourceClone,
    destination: destClone,
  };
};

// Writes a flat task list back into an infinite query's { pages, pageParams }
// shape, keeping the page count so pageParams stay aligned. The last page
// absorbs any difference in length.
export const toInfiniteData = (data, tasks) => {
  let start = 0;
  const pages = data.pages.map((page, i) => {
    const isLastPage = i === data.pages.length - 1;
    const end = isLastPage ? tasks.length : start + page.length;
    const chunk = tasks.slice(start, end);
    start = end;
    return chunk;
  });
  return { ...data, pages };
};
