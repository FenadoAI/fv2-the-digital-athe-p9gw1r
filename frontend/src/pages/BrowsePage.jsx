import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Search, Filter, ChevronLeft, ChevronRight, Library, Home } from 'lucide-react';
import gutendexService from '../services/gutendex';
import BookCard from '../components/BookCard';
import BookDetail from '../components/BookDetail';
import { getBookmarkCount } from '../utils/bookmarks';

const BrowsePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [topic, setTopic] = useState('');
  const [authorYearStart, setAuthorYearStart] = useState('');
  const [authorYearEnd, setAuthorYearEnd] = useState('');

  // Book detail modal
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    loadBooks();
    setBookmarkCount(getBookmarkCount());

    // Handle book passed from HomePage
    if (location.state?.selectedBook) {
      setSelectedBook(location.state.selectedBook);
      setDetailOpen(true);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [currentPage]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await gutendexService.getBooks({
        search: searchTerm || undefined,
        topic: topic || undefined,
        authorYearStart: authorYearStart || undefined,
        authorYearEnd: authorYearEnd || undefined,
        page: currentPage
      });

      setBooks(response.results);
      setTotalCount(response.count);
      setHasNext(!!response.next);
      setHasPrevious(!!response.previous);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadBooks();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTopic('');
    setAuthorYearStart('');
    setAuthorYearEnd('');
    setCurrentPage(1);
    setTimeout(loadBooks, 0);
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setDetailOpen(true);
  };

  const totalPages = Math.ceil(totalCount / 32); // Gutendex returns ~32 books per page

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900">
      {/* Header */}
      <header className="border-b border-amber-800/30 bg-stone-950/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-amber-300 hover:text-amber-100 hover:bg-amber-900/30"
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </Button>
              <div className="flex items-center gap-2 text-amber-300">
                <BookOpen className="h-6 w-6" />
                <span className="font-serif text-xl hidden sm:inline">The Digital Athenaeum</span>
              </div>
            </div>

            {bookmarkCount > 0 && (
              <Button
                variant="outline"
                onClick={() => navigate('/library')}
                className="border-amber-700 text-amber-300 hover:bg-amber-900/30"
              >
                <Library className="h-5 w-5 mr-2" />
                My Library ({bookmarkCount})
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8 bg-amber-900/20 border-2 border-amber-700/30 backdrop-blur">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Input
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-stone-900/50 border-amber-700/50 text-amber-100 placeholder:text-amber-400/50"
                  />
                </div>
                <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-amber-200 mb-2 block">Topic</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger className="bg-stone-900/50 border-amber-700/50 text-amber-100">
                      <SelectValue placeholder="All Topics" />
                    </SelectTrigger>
                    <SelectContent className="bg-stone-900 border-amber-700">
                      <SelectItem value="">All Topics</SelectItem>
                      <SelectItem value="Fiction">Fiction</SelectItem>
                      <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                      <SelectItem value="Fantasy">Fantasy</SelectItem>
                      <SelectItem value="Poetry">Poetry</SelectItem>
                      <SelectItem value="Drama">Drama</SelectItem>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Romance">Romance</SelectItem>
                      <SelectItem value="Mystery">Mystery</SelectItem>
                      <SelectItem value="Gothic">Gothic Fiction</SelectItem>
                      <SelectItem value="Philosophy">Philosophy</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Biography">Biography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-amber-200 mb-2 block">Author Birth Year (From)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1800"
                    value={authorYearStart}
                    onChange={(e) => setAuthorYearStart(e.target.value)}
                    className="bg-stone-900/50 border-amber-700/50 text-amber-100 placeholder:text-amber-400/50"
                  />
                </div>

                <div>
                  <Label className="text-amber-200 mb-2 block">Author Birth Year (To)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 1900"
                    value={authorYearEnd}
                    onChange={(e) => setAuthorYearEnd(e.target.value)}
                    className="bg-stone-900/50 border-amber-700/50 text-amber-100 placeholder:text-amber-400/50"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-amber-700 text-amber-300 hover:bg-amber-900/30"
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-amber-200">
            {loading ? 'Loading...' : `${totalCount.toLocaleString()} books found`}
          </p>
          {totalPages > 1 && (
            <p className="text-amber-200/70 text-sm">
              Page {currentPage} of {totalPages.toLocaleString()}
            </p>
          )}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="h-80 bg-amber-900/20 border-2 border-amber-700/30 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={handleViewDetails}
                onBookmarkToggle={() => setBookmarkCount(getBookmarkCount())}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-amber-900/20 border-2 border-amber-700/30">
            <BookOpen className="h-16 w-16 text-amber-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-serif text-amber-100 mb-2">No books found</h3>
            <p className="text-amber-200/70">Try adjusting your search or filters</p>
          </Card>
        )}

        {/* Pagination */}
        {(hasNext || hasPrevious) && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={!hasPrevious || loading}
              onClick={() => setCurrentPage(p => p - 1)}
              className="border-amber-700 text-amber-300 hover:bg-amber-900/30 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={!hasNext || loading}
              onClick={() => setCurrentPage(p => p + 1)}
              className="border-amber-700 text-amber-300 hover:bg-amber-900/30 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* Book Detail Modal */}
      <BookDetail
        book={selectedBook}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onBookmarkToggle={() => setBookmarkCount(getBookmarkCount())}
      />
    </div>
  );
};

export default BrowsePage;
