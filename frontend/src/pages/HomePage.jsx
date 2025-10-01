import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Search, Library, BookMarked, ArrowRight, Sparkles } from 'lucide-react';
import gutendexService from '../services/gutendex';
import BookCard from '../components/BookCard';
import { getBookmarkCount } from '../utils/bookmarks';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    loadFeaturedBooks();
    setBookmarkCount(getBookmarkCount());
  }, []);

  const loadFeaturedBooks = async () => {
    try {
      setLoading(true);
      // Load some popular classic books
      const response = await gutendexService.getBooks({
        topic: 'Fiction',
        page: 1
      });
      setFeaturedBooks(response.results.slice(0, 6));
    } catch (error) {
      console.error('Error loading featured books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (book) => {
    navigate('/browse', { state: { selectedBook: book } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-900 to-teal-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-cyan-900/40 p-4 rounded-full border-2 border-cyan-400/50">
                <BookOpen className="h-16 w-16 text-cyan-300" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-cyan-50 mb-6 tracking-tight">
              The Digital Athenaeum
            </h1>

            <p className="text-xl md:text-2xl text-cyan-100/80 mb-8 font-light leading-relaxed">
              A curated sanctuary of timeless literature from the public domain
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={() => navigate('/browse')}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg font-serif"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore the Collection
              </Button>

              {bookmarkCount > 0 && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/library')}
                  className="border-2 border-cyan-400 text-cyan-100 hover:bg-cyan-900/40 px-8 py-6 text-lg font-serif"
                >
                  <Library className="mr-2 h-5 w-5" />
                  My Library ({bookmarkCount})
                </Button>
              )}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <Card className="bg-cyan-900/30 border-2 border-cyan-500/30 backdrop-blur">
                <CardHeader>
                  <div className="bg-cyan-800/40 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                    <BookMarked className="h-6 w-6 text-cyan-300" />
                  </div>
                  <CardTitle className="text-cyan-50 font-serif">68,000+ Books</CardTitle>
                  <CardDescription className="text-cyan-100/70">
                    Access a vast collection of public domain literature from Project Gutenberg
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-cyan-900/30 border-2 border-cyan-500/30 backdrop-blur">
                <CardHeader>
                  <div className="bg-cyan-800/40 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-cyan-300" />
                  </div>
                  <CardTitle className="text-cyan-50 font-serif">Smart Bookmarking</CardTitle>
                  <CardDescription className="text-cyan-100/70">
                    Save your favorite titles to your personal library, no account required
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-cyan-900/30 border-2 border-cyan-500/30 backdrop-blur">
                <CardHeader>
                  <div className="bg-cyan-800/40 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                    <Search className="h-6 w-6 text-cyan-300" />
                  </div>
                  <CardTitle className="text-cyan-50 font-serif">Advanced Search</CardTitle>
                  <CardDescription className="text-cyan-100/70">
                    Filter by topic, author era, and language to find exactly what you seek
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold text-cyan-50">Featured Classics</h2>
          <Button
            variant="ghost"
            onClick={() => navigate('/browse')}
            className="text-cyan-200 hover:text-cyan-50 hover:bg-cyan-900/40"
          >
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-64 bg-cyan-900/30 border-2 border-cyan-500/30 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={handleViewDetails}
                onBookmarkToggle={() => setBookmarkCount(getBookmarkCount())}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-cyan-500/30 bg-blue-950/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-cyan-200">
              <BookOpen className="h-5 w-5" />
              <span className="font-serif text-lg">The Digital Athenaeum</span>
            </div>
            <p className="text-cyan-100/60 text-sm text-center">
              Powered by Project Gutenberg • Built with care for book lovers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
