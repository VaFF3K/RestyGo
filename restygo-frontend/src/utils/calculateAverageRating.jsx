export default function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return { average: 0, count: 0 };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Math.round(sum / reviews.length);

    return { average: avg, count: reviews.length };
}
