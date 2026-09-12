import { useEffect, useState } from "react";
import { listResource } from "./resourceApi.js";
import { lookupConfigs } from "./resourceConfigs.js";

export function useLookups(names = []) {
  const [lookups, setLookups] = useState({});

  useEffect(() => {
    let active = true;
    async function load() {
      const entries = await Promise.all(
        names.map(async (name) => {
          const config = lookupConfigs[name];
          if (!config) {
            return [name, { rows: [], map: new Map() }];
          }
          const result = await listResource(config.endpoint, { page: 1, limit: 500 });
          const map = new Map(result.rows.map((row) => [String(row[config.key]), row]));
          return [name, { rows: result.rows, map }];
        })
      );
      if (active) {
        setLookups(Object.fromEntries(entries));
      }
    }
    load().catch(() => {
      if (active) {
        setLookups({});
      }
    });
    return () => {
      active = false;
    };
  }, [names.join("|")]);

  return lookups;
}
