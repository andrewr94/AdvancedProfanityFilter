const expect = require('chai').expect;
import Domain from './built/domain';
import WebConfig from './built/webConfig';

const domains = {
  'another.com': { adv: true },
  'a.example.com': { enabled: true },
  'www.example.com': { disabled: true },
  'abc.zoo.edu': { disabled: true }
};

describe('Domain', function() {
  describe('.byKey()', function() {
    it('should give a new domain with defaults if no matching record', function() {
      let cfg = new WebConfig({ domains: domains });
      let key = 'www.example.org';
      let domain = Domain.byKey(key, cfg.domains);
      expect(domain.advanced).to.be.undefined;
      expect(domain.disabled).to.be.undefined;
      expect(domain.enabled).to.be.undefined;
      expect(domain.wordlist).to.be.undefined;
      expect(domain.audioList).to.be.undefined;
      expect(domain.cfgKey).to.eq(key);
    });

    it('should give a domain with exact domain match', function() {
      let cfg = new WebConfig({ domains: domains });
      let key = 'www.example.com';
      let domain = Domain.byKey(key, cfg.domains);
      expect(domain.advanced).to.be.undefined;
      expect(domain.disabled).to.be.true;
      expect(domain.cfg.disabled).to.be.true;
      expect(domain.enabled).to.be.undefined;
      expect(domain.wordlist).to.be.undefined;
      expect(domain.audioList).to.be.undefined;
      expect(domain.cfgKey).to.eq(key);
    });

    it('should give return for exact match', function() {
      let cfg = new WebConfig({ domains: domains });
      let key = 'sub.another.com';
      let domain = Domain.byKey(key, cfg.domains);
      expect(domain.advanced).to.be.undefined;
      expect(domain.disabled).to.be.undefined;
      expect(domain.enabled).to.be.undefined;
      expect(domain.wordlist).to.be.undefined;
      expect(domain.audioList).to.be.undefined;
      expect(domain.cfgKey).to.eq(key);
    });
  });

  describe('.byHostname()', function() {
    it('should give a new domain with defaults if no matching record', function() {
      let cfg = new WebConfig({ domains: domains });
      let hostname = 'www.example.org';
      let domain = Domain.byHostname(hostname, cfg.domains);
      expect(domain.advanced).to.be.undefined;
      expect(domain.disabled).to.be.undefined;
      expect(domain.enabled).to.be.undefined;
      expect(domain.wordlist).to.be.undefined;
      expect(domain.audioList).to.be.undefined;
      expect(domain.cfgKey).to.eq(hostname);
    });

    it('should give a domain with exact domain match', function() {
      let cfg = new WebConfig({ domains: domains });
      let hostname = 'www.example.com';
      let domain = Domain.byHostname(hostname, cfg.domains);
      expect(domain.advanced).to.be.undefined;
      expect(domain.disabled).to.be.true;
      expect(domain.cfg.disabled).to.be.true;
      expect(domain.enabled).to.be.undefined;
      expect(domain.wordlist).to.be.undefined;
      expect(domain.audioList).to.be.undefined;
      expect(domain.cfgKey).to.eq(hostname);
    });

    it('should give a parent domain for subdomain', function() {
      let cfg = new WebConfig({ domains: domains });
      let hostname = 'sub.another.com';
      let domain = Domain.byHostname(hostname, cfg.domains);
      expect(domain.advanced).to.be.true;
      expect(domain.cfg.adv).to.be.true;
      expect(domain.disabled).to.be.undefined;
      expect(domain.enabled).to.be.undefined;
      expect(domain.wordlist).to.be.undefined;
      expect(domain.audioList).to.be.undefined;
      expect(domain.cfgKey).to.eq('another.com');
    });
  });

  describe('.findDomainKey()', function() {
    let cfg = new WebConfig({ domains: domains });
    it('should return an exact match', function() { expect(Domain.findDomainKey('www.example.com', cfg.domains)).to.eq('www.example.com'); });
    it('should match a subdomain of a parent', function() { expect(Domain.findDomainKey('sub.another.com', cfg.domains)).to.eq('another.com'); });
    it('return undefined if no match', function() { expect(Domain.findDomainKey('nowhere.com', cfg.domains)).to.be.undefined; });
  });

  describe('.sortedKeys()', function() {
    let cfg = new WebConfig({ domains: domains });
    it('should sort domains by parent', function() {
      expect(Domain.sortedKeys(cfg.domains)).to.eql(['another.com', 'a.example.com', 'www.example.com', 'abc.zoo.edu']);
    });
  });

  describe('updateCfg()', function() {
    it('should update domain.cfg', function() {
      let domain = new Domain('new.domain.com');
      domain.advanced = true;
      expect(domain.cfg.adv).to.be.undefined;
      domain.updateCfg();
      expect(domain.cfg.adv).to.be.true;
    });
  });

  describe('updateFromCfg()', function() {
    it('should set domain attributes from domain.cfg', function() {
      let domain = new Domain('new.domain.com');
      domain.cfg.adv = true;
      expect(domain.advanced).to.be.undefined;
      domain.updateFromCfg();
      expect(domain.advanced).to.be.true;
    });
  });
});