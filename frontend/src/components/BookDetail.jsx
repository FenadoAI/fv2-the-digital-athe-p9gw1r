import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Download, User, Calendar, Languages, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { isBookmarked, toggleBookmark } from '../utils/bookmarks';

const BookDetail = ({ book, open, onOpenChange, onBookmarkToggle }) => {
  const [bookmarked, setBookmarked] = React.useState(false);

  React.useEffect(() => {
    if (book) {
      setBookmarked(isBookmarked(book.id));
    }
  }, [book]);

  if (!book) return null;

  const handleBookmarkClick = () => {
    const newStatus = toggleBookmark(book);
    setBookmarked(newStatus);
    if (onBookmarkToggle) onBookmarkToggle();
  };

  const getAuthorInfo = () => {
    if (!book.authors || book.authors.length === 0) {
      return [{ name: 'Unknown Author', birth_year: null, death_year: null }];
    }
    return book.authors;
  };

  const getDownloadLinks = () => {
    if (!book.formats) return [];

    const formatLabels = {
      'text/html': { label: 'Read Online (HTML)', icon: BookOpen },
      'application/epub+zip': { label: 'EPUB', icon: Download },
      'application/x-mobipocket-ebook': { label: 'Kindle (MOBI)', icon: Download },
      'text/plain': { label: 'Plain Text', icon: Download },
      'application/pdf': { label: 'PDF', icon: Download },
    };

    return Object.entries(book.formats)
      .filter(([type]) => formatLabels[type])
      .map(([type, url]) => ({
        type,
        url,
        label: formatLabels[type].label,
        icon: formatLabels[type].icon,
      }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-gradient-to-br from-cyan-50 to-blue-100 border-2 border-cyan-400">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <DialogTitle className="text-2xl font-serif text-cyan-950 leading-tight pr-8">
                {book.title}
              </DialogTitle>
              <DialogDescription className="text-cyan-800 mt-2">
                {getAuthorInfo().map((author, idx) => (
                  <div key={idx} className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{author.name}</span>
                    {(author.birth_year || author.death_year) && (
                      <span className="text-sm text-cyan-700">
                        ({author.birth_year || '?'} - {author.death_year || '?'})
                      </span>
                    )}
                  </div>
                ))}
              </DialogDescription>
            </div>
            <Button
              variant={bookmarked ? "default" : "outline"}
              size="icon"
              onClick={handleBookmarkClick}
              className={bookmarked ? "bg-cyan-600 hover:bg-cyan-700" : "border-cyan-600 text-cyan-700 hover:bg-cyan-100"}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Book Info */}
            <div className="flex flex-wrap gap-4 text-sm text-cyan-800">
              {book.languages && book.languages.length > 0 && (
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span>Language: {book.languages.join(', ').toUpperCase()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>{book.download_count?.toLocaleString() || 0} downloads</span>
              </div>
              {!book.copyright && (
                <Badge variant="secondary" className="bg-green-200 text-green-900">
                  Public Domain
                </Badge>
              )}
            </div>

            <Separator className="bg-cyan-400" />

            {/* Subjects */}
            {book.subjects && book.subjects.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-cyan-950 mb-2">Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.map((subject, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="border-cyan-500 text-cyan-900 bg-cyan-50"
                    >
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Bookshelves */}
            {book.bookshelves && book.bookshelves.length > 0 && (
              <div>
                <h3 className="font-serif font-semibold text-cyan-950 mb-2">Bookshelves</h3>
                <div className="flex flex-wrap gap-2">
                  {book.bookshelves.map((shelf, idx) => (
                    <Badge
                      key={idx}
                      className="bg-cyan-200 text-cyan-950 hover:bg-cyan-300"
                    >
                      {shelf}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-cyan-400" />

            {/* Download Links */}
            <div>
              <h3 className="font-serif font-semibold text-cyan-950 mb-3">Download & Read</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {getDownloadLinks().map((format, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="justify-start border-cyan-500 hover:bg-cyan-200"
                    asChild
                  >
                    <a href={format.url} target="_blank" rel="noopener noreferrer">
                      <format.icon className="h-4 w-4 mr-2" />
                      {format.label}
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetail;
