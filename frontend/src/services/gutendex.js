import axios from 'axios';

const GUTENDEX_BASE_URL = 'https://gutendex.com';

/**
 * Gutendex API Service
 * Provides methods to interact with the Gutendex free books API
 */
class GutendexService {
  /**
   * Fetch books with optional filters and pagination
   * @param {Object} options - Query options
   * @param {string} options.search - Search term for title/author
   * @param {string} options.topic - Filter by topic
   * @param {number} options.authorYearStart - Filter by author birth year start
   * @param {number} options.authorYearEnd - Filter by author birth year end
   * @param {number} options.page - Page number (default: 1)
   * @returns {Promise<Object>} Response with books array and pagination info
   */
  async getBooks(options = {}) {
    try {
      const params = new URLSearchParams();

      if (options.search) params.append('search', options.search);
      if (options.topic) params.append('topic', options.topic);
      if (options.authorYearStart) params.append('author_year_start', options.authorYearStart);
      if (options.authorYearEnd) params.append('author_year_end', options.authorYearEnd);
      if (options.page) params.append('page', options.page);

      const url = `${GUTENDEX_BASE_URL}/books/?${params.toString()}`;
      const response = await axios.get(url);

      return {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        results: response.data.results,
        currentPage: options.page || 1
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  /**
   * Get book by ID
   * @param {number} id - Book ID
   * @returns {Promise<Object>} Book details
   */
  async getBookById(id) {
    try {
      const response = await axios.get(`${GUTENDEX_BASE_URL}/books/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }

  /**
   * Extract popular topics from books
   * @param {Array} books - Array of books
   * @returns {Array<string>} Array of unique topics
   */
  extractTopics(books) {
    const topicsSet = new Set();
    books.forEach(book => {
      if (book.subjects) {
        book.subjects.forEach(subject => {
          // Extract main topic before " -- "
          const mainTopic = subject.split(' -- ')[0];
          topicsSet.add(mainTopic);
        });
      }
    });
    return Array.from(topicsSet).sort();
  }
}

export default new GutendexService();
