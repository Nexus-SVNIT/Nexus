

export const fetchContributors = async (GITHUB_TOKEN, OWNER, REPO) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/stats/contributors`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    
    const data = await response.json();
    
    // Process and structure the data
    const contributorsByYear = data.reduce((acc, contributor) => {
      const details = {
        name: contributor.author.login,
        github: contributor.author.login,
        commits: contributor.total,
        avatar: contributor.author.avatar_url,
      };

      // Get the latest contribution year
      const weeks = contributor.weeks;
      const latestWeek = weeks.filter(week => week.c > 0).pop();
      if (latestWeek) {
        const year = new Date(latestWeek.w * 1000).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(details);
      }

      return acc;
    }, {});

    // Sort contributors by commit count within each year
    Object.keys(contributorsByYear).forEach(year => {
      contributorsByYear[year].sort((a, b) => b.commits - a.commits);
    });

    return contributorsByYear;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return {};
  }
};
