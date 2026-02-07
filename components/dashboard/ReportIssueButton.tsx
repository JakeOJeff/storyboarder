'use client';

import { Bug } from 'lucide-react';

export function ReportIssueButton() {
    return (
        <a
            href="https://hackclub.enterprise.slack.com/team/U08DDHGPBCM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 hover:shadow-md active:scale-95"
            title="Report an issue"
        >
            <Bug className="h-4 w-4" />
            <span className="hidden sm:inline">Report Issue</span>
        </a>
    );
}
