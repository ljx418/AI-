// useLessons.js — 全局共享 LESSONS 异步加载 hook
// 解决 lessons.json 2.6MB 同步加载阻塞首屏问题
import { useEffect, useState } from 'react';

let cache = null;
let pendingPromise = null;

async function loadLessons() {
  if (cache) return cache;
  if (pendingPromise) return pendingPromise;
  pendingPromise = fetch('/src/data/lessons.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      cache = data;
      return data;
    });
  return pendingPromise;
}

export function useLessons() {
  const [lessons, setLessons] = useState(cache);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) {
      setLessons(cache);
      setLoading(false);
      return;
    }
    let cancelled = false;
    loadLessons()
      .then(data => {
        if (!cancelled) {
          setLessons(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  return { lessons, loading, error };
}

export { loadLessons };