import { Link } from 'react-router-dom';

const BookCard = ({ book, canManage, onDelete }) => (
  <article className="rounded-3xl border border-ink/10 bg-paper p-5 shadow-soft transition hover:-translate-y-1">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-clay">{book.category}</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-ink">{book.title}</h3>
        <p className="text-ink/65">by {book.author}</p>
      </div>
      <span className="rounded-full bg-moss/10 px-3 py-1 text-sm font-bold text-moss">{book.availableCopies}/{book.totalCopies}</span>
    </div>
    <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink/65">{book.description}</p>
    <p className="mt-4 text-sm text-ink/55">ISBN: {book.ISBN}</p>
    <div className="mt-5 flex flex-wrap gap-2">
      <Link className="rounded-full border border-ink/15 px-4 py-2 text-sm font-bold text-ink" to={`/books/${book._id}`}>Details</Link>
      {!canManage && <Link className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-cream" to={`/issue-book?bookId=${book._id}`}>Borrow</Link>}
      {canManage && <Link className="rounded-full border border-ink/15 px-4 py-2 text-sm font-bold text-ink" to={`/edit-book/${book._id}`}>Edit</Link>}
      {canManage && onDelete && <button className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700" onClick={() => onDelete(book._id)}>Delete</button>}
    </div>
  </article>
);

export default BookCard;
