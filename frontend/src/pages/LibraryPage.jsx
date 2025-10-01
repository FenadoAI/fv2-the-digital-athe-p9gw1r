import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BookOpen, Home, Search, Trash2, Library as LibraryIcon } from 'lucide-react';
import BookCard from '../components/BookCard';
import BookDetail from '../components/BookDetail';
import { getBookmarks, clearAllBookmarks } from '../utils/bookmarks';

const LibraryPage = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, bookmarks]);

  const loadBookmarks = () => {
    const savedBooks = getBookmarks();
    // Sort by bookmarked date (newest first)
    savedBooks.sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt));
    setBookmarks(savedBooks);
  };

  const filterBooks = () => {
    if (!searchTerm.trim()) {
      setFilteredBooks(bookmarks);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = bookmarks.filter(book => {
      const titleMatch = book.title?.toLowerCase().includes(term);
      const authorMatch = book.authors?.some(author =>
        author.name?.toLowerCase().includes(term)
      );
      return titleMatch || authorMatch;
    });

    setFilteredBooks(filtered);
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setDetailOpen(true);
  };

  const handleClearAll = () => {
    clearAllBookmarks();
    setBookmarks([]);
    setClearDialogOpen(false);
  };

  const handleBookmarkUpdate = () => {
    loadBookmarks();
  };

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

            <Button
              variant="outline"
              onClick={() => navigate('/browse')}
              className="border-amber-700 text-amber-300 hover:bg-amber-900/30"
            >
              <Search className="h-5 w-5 mr-2" />
              Browse Books
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-800/30 p-3 rounded-lg border-2 border-amber-700/50">
              <LibraryIcon className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-amber-100">My Library</h1>
              <p className="text-amber-200/70 mt-1">
                {bookmarks.length} {bookmarks.length === 1 ? 'book' : 'books'} in your collection
              </p>
            </div>
          </div>

          {/* Search and Actions */}
          {bookmarks.length > 0 && (
            <Card className="bg-amber-900/20 border-2 border-amber-700/30 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <Input
                      placeholder="Search your library..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-stone-900/50 border-amber-700/50 text-amber-100 placeholder:text-amber-400/50"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setClearDialogOpen(true)}
                    className="border-red-700 text-red-300 hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Books Grid */}
        {bookmarks.length === 0 ? (
          <Card className="p-16 text-center bg-amber-900/20 border-2 border-amber-700/30">
            <LibraryIcon className="h-20 w-20 text-amber-400 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-serif text-amber-100 mb-3">Your library is empty</h3>
            <p className="text-amber-200/70 mb-6 max-w-md mx-auto">
              Start exploring our collection and bookmark your favorite books to build your personal library
            </p>
            <Button
              onClick={() => navigate('/browse')}
              className="bg-amber-700 hover:bg-amber-800 text-white px-8"
            >
              <Search className="h-5 w-5 mr-2" />
              Browse Books
            </Button>
          </Card>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={handleViewDetails}
                onBookmarkToggle={handleBookmarkUpdate}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-amber-900/20 border-2 border-amber-700/30">
            <Search className="h-16 w-16 text-amber-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-serif text-amber-100 mb-2">No books found</h3>
            <p className="text-amber-200/70">No books match your search criteria</p>
            <Button
              variant="ghost"
              onClick={() => setSearchTerm('')}
              className="mt-4 text-amber-300 hover:text-amber-100"
            >
              Clear search
            </Button>
          </Card>
        )}
      </div>

      {/* Book Detail Modal */}
      <BookDetail
        book={selectedBook}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onBookmarkToggle={handleBookmarkUpdate}
      />

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent className="bg-stone-900 border-2 border-amber-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-amber-100 font-serif">Clear All Bookmarks?</AlertDialogTitle>
            <AlertDialogDescription className="text-amber-200/70">
              This will permanently remove all {bookmarks.length} books from your library. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-amber-700 text-amber-300 hover:bg-amber-900/30">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LibraryPage;
