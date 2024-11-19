document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch("http://localhost:3001/data"); // Replace with your API URL
        const data = await response.json();
        let pinnedRows = [];
        let filteredData = [...data]; // To keep track of filtered data
        const leaderboardBody = document.getElementById('leaderboard-body');
        const sectionFilter = document.getElementById('section-filter');

        // Populate section filter dropdown
        const populateSectionFilter = () => {
            const sections = [...new Set(data.map(student => student.section || 'N/A'))].sort();
            sectionFilter.innerHTML = '<option value="all">All Sections</option>';
            sections.forEach(section => {
                const option = document.createElement('option');
                option.value = section;
                option.textContent = section;
                sectionFilter.appendChild(option);
            });
        };

        // Render leaderboard
        const renderLeaderboard = () => {
            leaderboardBody.innerHTML = '';

            // Combine pinned rows and unpinned rows
            const combinedData = [...pinnedRows, ...filteredData.filter(student => !pinnedRows.includes(student))];

            combinedData.forEach((student, index) => {
                const row = document.createElement('tr');
                row.classList.add('border-b', 'border-gray-700');
                row.innerHTML = `
                    <td class="p-4 text-center">
                        <button class="pin-btn text-gray-500 hover:text-yellow-500">
                            <i class="${pinnedRows.includes(student) ? 'fas fa-thumbtack text-yellow-500' : 'far fa-thumbtack'}"></i>
                        </button>
                    </td>
                    <td class="p-4">${index + 1}</td>
                    <td class="p-4">${student.roll}</td>
                    <td class="p-4">
                        ${student.url.startsWith('https://leetcode.com/u/') 
                            ? `<a href="${student.url}" target="_blank" class="text-blue-400">${student.name}</a>` 
                            : `<div class="text-red-500">${student.name}</div>`}
                    </td>
                    <td class="p-4">${student.section || 'N/A'}</td>
                    <td class="p-4">${student.totalSolved || 'N/A'}</td>
                    <td class="p-4 text-green-400">${student.easySolved || 'N/A'}</td>
                    <td class="p-4 text-yellow-400">${student.mediumSolved || 'N/A'}</td>
                    <td class="p-4 text-red-400">${student.hardSolved || 'N/A'}</td>
                `;

                // Add event listener for pin functionality
                row.querySelector('.pin-btn').addEventListener('click', () => {
                    togglePin(student);
                });

                leaderboardBody.appendChild(row);
            });
        };

        // Toggle pin/unpin a row
        const togglePin = (student) => {
            if (pinnedRows.includes(student)) {
                pinnedRows = pinnedRows.filter(p => p !== student); // Unpin
            } else {
                pinnedRows.push(student); // Pin
            }
            renderLeaderboard();
        };

        // Filter data based on section
        sectionFilter.addEventListener('change', (e) => {
            const section = e.target.value;
            filteredData = section === 'all' 
                ? [...data]
                : data.filter(student => (student.section || 'N/A') === section);
            renderLeaderboard();
        });

        populateSectionFilter();
        renderLeaderboard();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});