const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  const dateISO = date.toISOString();

  if (new Date().toDateString() === date.toDateString()) {
    return dateISO.split("T")[1].slice(0, 5);
  } else {
    return dateISO.split("T")[0];
  }
};

export default formatDate;
