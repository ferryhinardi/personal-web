import {Link} from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Page not found
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">
        Go Home
      </Link>
    </section>
  );
}
