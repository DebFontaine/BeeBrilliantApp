export function getLocalDate(dateString: any) {
    const dateObject = new Date(dateString); // Convert the string to a Date object

    // Check if the conversion was successful
    if (!isNaN(dateObject.getTime())) {
      // Format the date as "MM/DD/YYYY"
      const formattedDate = dateObject.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
      return formattedDate;
    }
    return dateString;
  }