/**
 * @typedef {'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'} ChangeFrequency
 *
 * @param {string} loc
 * @param {ChangeFrequency} changefreq
 * @param {number} priority
 * @returns {
 *  loc: string,
 *  changefreq: ChangeFrequency,
 *  priority: number,
 *  lastmod: string,
 * }
 */
function transformPath(loc, changefreq, priority) {
    return {
        loc,
        changefreq,
        priority,
        lastmod: new Date().toISOString(),
    };
}

// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://www.shadowaya.me",
    generateRobotsTxt: true,
    exclude: ["/stratle/game", "/stratle/library", "*.png"],
    transform: async (config, path) => {
        if (
            path.startsWith("/lethal-calculator") ||
            path.startsWith("/stratle") ||
            path.startsWith("/kustom-kompiler")
        ) {
            return transformPath(path, "weekly", 0.5);
        }
        if (path === "/") {
            return transformPath(path, "daily", 0.9);
        }
        return transformPath(path, "daily", 0.7);
    },
};
