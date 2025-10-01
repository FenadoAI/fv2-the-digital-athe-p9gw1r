import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, Bookmark, BookmarkCheck } from 'lucide-react';
import { isBookmarked, toggleBookmark } from '../utils/bookmarks';

const BookCard = ({ book, onBookmarkToggle, onViewDetails }) => {
  const [bookmarked, setBookmarked] = React.useState(isBookmarked(book.id));

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    const newStatus = toggleBookmark(book);
    setBookmarked(newStatus);
    if (onBookmarkToggle) onBookmarkToggle();
  };

  const getAuthorNames = () => {
    if (!book.authors || book.authors.length === 0) return 'Unknown Author';
    return book.authors.map(a => a.name).join(', ');
  };

  const getMainSubjects = () => {
    if (!book.subjects || book.subjects.length === 0) return [];
    return book.subjects.slice(0, 3).map(subject => {
      // Extract main topic
      return subject.split(' -- ')[0];
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-stone-100/80 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-serif leading-tight text-amber-950 group-hover:text-amber-800 transition-colors line-clamp-2">
            {book.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmarkClick}
            className="shrink-0 hover:bg-amber-200/50"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-amber-700 fill-amber-700" />
            ) : (
              <Bookmark className="h-5 w-5 text-amber-700" />
            )}
          </Button>
        </div>
        <p className="text-sm text-amber-800/80 font-medium mt-1">{getAuthorNames()}</p>
      </CardHeader>

      <CardContent className="flex-grow pb-3" onClick={() => onViewDetails && onViewDetails(book)}>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {getMainSubjects().map((subject, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs bg-amber-200/60 text-amber-900 hover:bg-amber-200"
            >
              {subject}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-amber-800/60">
          <div className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>{book.download_count?.toLocaleString() || 0}</span>
          </div>
          {book.languages && book.languages.length > 0 && (
            <Badge variant="outline" className="text-xs border-amber-300 text-amber-800">
              {book.languages[0].toUpperCase()}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-amber-200/50">
        <Button
          variant="outline"
          className="w-full bg-amber-100/50 border-amber-300 text-amber-900 hover:bg-amber-200 hover:text-amber-950"
          onClick={() => onViewDetails && onViewDetails(book)}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
