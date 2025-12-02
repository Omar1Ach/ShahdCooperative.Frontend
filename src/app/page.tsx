export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center">
            🎉 Tailwind CSS is Configured!
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-center text-lg">
            Your Next.js project is now ready with Tailwind CSS v4
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Fast</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Lightning speed development</p>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Beautiful</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Stunning designs made easy</p>
            </div>

            <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Ready</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Start building now</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg">
              Get Started
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Learn More
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Shahd Cooperative Frontend - Built with Next.js 16 + Tailwind CSS v4
        </p>
      </div>
    </div>
  );
}
