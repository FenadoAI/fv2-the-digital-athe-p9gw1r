/**
 * Local Storage Bookmark Management
 * Handles saving, retrieving, and managing bookmarked books
 */

const BOOKMARKS_KEY = 'digital_athenaeum_bookmarks';

/**
 * Get all bookmarked books from localStorage
 * @returns {Array} Array of bookmarked books
 */
export const getBookmarks = () => {
  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error retrieving bookmarks:', error);
    return [];
  }
};

/**
 * Check if a book is bookmarked
 * @param {number} bookId - Book ID to check
 * @returns {boolean} True if bookmarked
 */
export const isBookmarked = (bookId) => {
  const bookmarks = getBookmarks();
  return bookmarks.some(book => book.id === bookId);
};

/**
 * Add a book to bookmarks
 * @param {Object} book - Book object to bookmark
 * @returns {boolean} Success status
 */
export const addBookmark = (book) => {
  try {
    const bookmarks = getBookmarks();

    // Check if already bookmarked
    if (bookmarks.some(b => b.id === book.id)) {
      return false;
    }

    // Add timestamp for sorting
    const bookmarkWithTimestamp = {
      ...book,
      bookmarkedAt: new Date().toISOString()
    };

    bookmarks.push(bookmarkWithTimestamp);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return false;
  }
};

/**
 * Remove a book from bookmarks
 * @param {number} bookId - Book ID to remove
 * @returns {boolean} Success status
 */
export const removeBookmark = (bookId) => {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(book => book.id !== bookId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
};

/**
 * Toggle bookmark status
 * @param {Object} book - Book object
 * @returns {boolean} New bookmark status (true if added, false if removed)
 */
export const toggleBookmark = (book) => {
  if (isBookmarked(book.id)) {
    removeBookmark(book.id);
    return false;
  } else {
    addBookmark(book);
    return true;
  }
};

/**
 * Get bookmark count
 * @returns {number} Number of bookmarked books
 */
export const getBookmarkCount = () => {
  return getBookmarks().length;
};

/**
 * Clear all bookmarks
 * @returns {boolean} Success status
 */
export const clearAllBookmarks = () => {
  try {
    localStorage.removeItem(BOOKMARKS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing bookmarks:', error);
    return false;
  }
};
