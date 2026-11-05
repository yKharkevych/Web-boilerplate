let pivot = null;

function toReportData(teachers) {
    const metadata = {
        Teacher: { type: 'string', caption: 'Teacher Name' },
        Country: { type: 'string', caption: 'Country' },
        Speciality: { type: 'string', caption: 'Speciality' },
        Age: { type: 'number', caption: 'Age' },
        Gender: { type: 'string', caption: 'Gender' },
        City: { type: 'string', caption: 'City' },
        Email: { type: 'string', caption: 'Email' },
        Phone: { type: 'string', caption: 'Phone Number' },
        Birthday: { type: 'string', caption: 'Date of Birth' }
    };

    return [metadata, ...teachers.map(teacher => ({
        Teacher: teacher.full_name || 'Unknown',
        Country: teacher.country || 'Unknown',
        Speciality: teacher.course || 'Unknown',
        Age: Number.isFinite(Number(teacher.age)) && teacher.age !== null && teacher.age !== ''
            ? Number(teacher.age) : null,
        Gender: teacher.gender || 'Unknown',
        City: teacher.city || 'Unknown',
        Email: teacher.email || '',
        Phone: teacher.phone || '',
        Birthday: teacher.b_date ? String(teacher.b_date).slice(0, 10) : ''
    }))];
}

function buildReport(teachers, mode) {
    const report = {
        dataSource: { data: toReportData(teachers) },
        options: {
            grid: {
                type: mode === 'flat' ? 'flat' : 'compact',
                showGrandTotals: mode === 'flat' ? 'off' : 'on'
            }
        }
    };

    if (mode === 'country') {
        report.slice = {
            rows: [{ uniqueName: 'Country' }],
            columns: [{ uniqueName: 'Measures' }],
            measures: [{
                uniqueName: 'Teacher',
                aggregation: 'count',
                caption: 'Number of Teachers'
            }]
        };
    }
    return report;
}

export function renderTeachersReport(teachers, mode = 'country') {
    const container = document.querySelector('#pivot-container');
    const summary = document.querySelector('#report-summary');

    if (!container || container.closest('[hidden]')) return;

    summary.textContent = `${teachers.length} loaded teacher${teachers.length === 1 ? '' : 's'}`;

    if (typeof WebDataRocks !== 'function') {
        container.textContent = 'WebDataRocks could not be loaded. Check your internet connection.';
        return;
    }

    const report = buildReport(teachers, mode);
    if (!pivot) {
        pivot = new WebDataRocks({
            container: '#pivot-container',
            toolbar: true,
            height: 480,
            report
        });
    } else {
        pivot.setReport(report);
    }
}
