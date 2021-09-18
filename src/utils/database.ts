
import fs from 'fs';
import lodash from 'lodash';

import { isAsync, KotObjects } from '@shine-utils';

interface AnyProp {
    [prop: string | number]: any
}

interface ICreateDatabaseOptions {
    path: string;
    default_config: AnyProp;
    autoupdate?: boolean;
    useidx?: boolean;
}

class RinkiDatabase {

    path: string;
    autoupdate: boolean = true;
    useidx: boolean = false;
    db: AnyProp;

    constructor(options: ICreateDatabaseOptions) {
        
        this.path = options.path
        if (options.autoupdate !== undefined) this.autoupdate = options.autoupdate  
        if (options.useidx !== undefined) this.useidx = options.useidx  
        
        if(!fs.existsSync(this.path)) fs.writeFileSync(this.path, JSON.stringify(options.default_config, null, '\t'));
        const b = (fs.readFileSync(this.path).toString());
        
        this.db = lodash.defaultsDeep(b.length == 0 ? {} : JSON.parse(b), options.default_config);

    };

    updater() {
        const b = (fs.readFileSync(this.path).toString());
        this.db = b.length == 0 ? (this.updatew({}), {}) : JSON.parse(b);
    };
    updatew(wo?: AnyProp) {
        fs.writeFileSync(this.path, JSON.stringify(wo !== undefined ? wo : this.db, null, '\t'));
    };

    async get(p: string) {
        if (this.autoupdate) this.updater();
        return KotObjects.get(this.db, p, this.useidx);
    };
    async set(p: string, o: AnyProp) {
        KotObjects.set(this.db, p, o, this.useidx);
        if (this.autoupdate) this.updatew();
    };
    async push(p: string, o: AnyProp) {
        const ob = KotObjects.get(this.db, p, this.useidx);
        if(ob === null) throw new Error('push path is null');
        if(!Array.isArray(ob)) throw new Error('push path type is not array');
        ob.push(o);
        if (this.autoupdate) this.updatew();
    };
    async counter(p: string, n: number = 1) {
        let a = KotObjects.get(this.db, p, this.useidx);
        if(a === null) throw new Error('counter path is null');
        if(typeof a !== 'number') throw new Error('counter path type is not number');
        KotObjects.set(this.db, p, a+n, this.useidx);
        if (this.autoupdate) this.updatew();
        return a+n;
    };

    async search(p: string, c: any, m?: number) {

        const searcher = KotObjects.get(this.db,p, this.useidx);
        if (searcher === null) throw new Error('path is null');

        let res = [];
        let counter = 0;
        for (const k in searcher) {
            if(m !== undefined && counter > m) break;
            const v = searcher[k];
            const cres = isAsync(c) ? await c(v,k) : c(v,k);
            if (cres) res.push({
                key: k,
                value: v,
                path: p,
            });
            counter++;
        };

        return res;
    };

};

export default RinkiDatabase;