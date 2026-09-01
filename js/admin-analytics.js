(function () {
  'use strict';

  var SUPABASE_URL = 'https://fuiwasujyhmdrccattvz.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aXdhc3VqeWhtZHJjY2F0dHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyODk3MjMsImV4cCI6MjEwMzg2NTcyM30.ybSx3Jl7pKBJHVcNj2Hz_R2u3LICkMGgtWMO8Kd0vs8';

  // A viewer counts as "currently watching" if their last heartbeat was
  // within this window (heartbeats fire every 20s from the live page).
  var ACTIVE_WINDOW_MS = 45 * 1000;

  var badge = document.getElementById('streamAnalyticsBadge');
  var currentlyWatchingEl = document.getElementById('streamCurrentlyWatching');
  var totalJoinedEl = document.getElementById('streamTotalJoined');
  var sessionTitleEl = document.getElementById('streamSessionTitle');
  var updatedEl = document.getElementById('streamAnalyticsUpdated');
  var viewersListEl = document.getElementById('streamViewersList');
  var pastSessionsEl = document.getElementById('streamPastSessions');
  var refreshBtn = document.getElementById('streamAnalyticsRefreshBtn');

  // Not every deployment of this dashboard necessarily includes the panel.
  if (!refreshBtn) return;

  function supabaseGet(path) {
    return fetch(SUPABASE_URL + '/rest/v1/' + path, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + SUPABASE_ANON_KEY },
    }).then(function (res) {
      if (!res.ok) throw new Error('Supabase request failed: ' + res.status);
      return res.json();
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function timeAgo(iso) {
    var seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
    if (seconds < 60) return seconds + 's ago';
    var mins = Math.round(seconds / 60);
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.round(mins / 60);
    return hrs + 'h ago';
  }

  function loadStreamAnalytics() {
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Refreshing…';

    // Most recent session (open or not) plus a small batch of history.
    var sessionsReq = supabaseGet('stream_sessions?select=*&order=started_at.desc&limit=11');

    sessionsReq
      .then(function (sessions) {
        if (!sessions.length) {
          badge.className = 'badge-mini offline';
          badge.textContent = 'NO SESSION';
          currentlyWatchingEl.textContent = '0';
          totalJoinedEl.textContent = '0';
          sessionTitleEl.textContent = 'No stream tracked yet';
          viewersListEl.innerHTML = '<p style="color:rgba(255,255,255,.55);font-size:.85rem;">Analytics will appear here once someone opens the live page during a stream.</p>';
          pastSessionsEl.innerHTML = '';
          return;
        }

        var current = sessions[0];
        var past = sessions.slice(1);
        var isOpen = !current.ended_at;

        badge.className = 'badge-mini ' + (isOpen ? 'live' : 'offline');
        badge.textContent = isOpen ? 'LIVE SESSION' : 'ENDED';
        sessionTitleEl.textContent = current.title + (isOpen ? '' : ' (ended)');

        return supabaseGet(
          'stream_viewers?select=id,name,group_size,joined_at,last_seen,left_at&session_id=eq.' + current.id + '&order=joined_at.desc'
        ).then(function (viewers) {
          var totalGroupSize = viewers.reduce(function (sum, v) { return sum + (v.group_size || 1); }, 0);
          var now = Date.now();
          var currentlyWatching = viewers.reduce(function (sum, v) {
            var active = !v.left_at && (now - new Date(v.last_seen).getTime()) < ACTIVE_WINDOW_MS;
            return active ? sum + (v.group_size || 1) : sum;
          }, 0);

          totalJoinedEl.textContent = totalGroupSize.toLocaleString();
          currentlyWatchingEl.textContent = isOpen ? currentlyWatching.toLocaleString() : '0';

          if (!viewers.length) {
            viewersListEl.innerHTML = '<p style="color:rgba(255,255,255,.55);font-size:.85rem;">No viewers recorded for this session yet.</p>';
          } else {
            var rows = viewers.slice(0, 25).map(function (v) {
              var active = !v.left_at && (now - new Date(v.last_seen).getTime()) < ACTIVE_WINDOW_MS;
              var name = escapeHtml(v.name || 'Anonymous');
              var groupNote = v.group_size > 1 ? ' (+' + (v.group_size - 1) + ')' : '';
              var statusDot = active
                ? '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#7CF3B4;margin-right:6px;"></span>'
                : '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.25);margin-right:6px;"></span>';
              return (
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:.85rem;">' +
                '<span>' + statusDot + name + groupNote + '</span>' +
                '<span style="color:rgba(255,255,255,.5);">joined ' + timeAgo(v.joined_at) + '</span>' +
                '</div>'
              );
            }).join('');
            viewersListEl.innerHTML =
              '<div style="font-size:.75rem;color:rgba(255,255,255,.5);margin-bottom:6px;">Showing up to 25 most recent joins for this session</div>' +
              rows;
          }

          pastSessionsEl.innerHTML = past.length
            ? past.map(function (s) {
                var span = s.ended_at
                  ? new Date(s.started_at).toLocaleString() + ' → ' + new Date(s.ended_at).toLocaleString()
                  : new Date(s.started_at).toLocaleString() + ' (still open)';
                return (
                  '<div style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:.82rem;color:rgba(255,255,255,.75);">' +
                  '<strong>' + escapeHtml(s.title) + '</strong> — ' + span +
                  '</div>'
                );
              }).join('')
            : '<p style="color:rgba(255,255,255,.5);font-size:.82rem;">No earlier sessions yet.</p>';
        });
      })
      .then(function () {
        updatedEl.textContent = 'Updated ' + new Date().toLocaleTimeString();
      })
      .catch(function (err) {
        console.error(err);
        var statusEl = document.querySelector('[data-status-for="streamAnalytics"]');
        if (statusEl) {
          statusEl.className = 'admin-status-msg error';
          statusEl.textContent = "Couldn't load streaming analytics: " + err.message;
        }
      })
      .finally(function () {
        refreshBtn.disabled = false;
        refreshBtn.textContent = 'Refresh';
      });
  }

  refreshBtn.addEventListener('click', loadStreamAnalytics);
  loadStreamAnalytics();
})();
