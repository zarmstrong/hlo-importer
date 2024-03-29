## 0.10.1 (September 15, 2022)

* minor change to compatability info

## 0.10.0 (September 15, 2022)

* overhauled for Foundry v10 and pf2e 4.x

## 0.8.5 (May 25, 2022)

* no code change, just updated the module to show compatability with v9

## 0.8.4 (Mar 26, 2022)

* prevent module from showing up in non-pf2e systems

## 0.8.3 (Jan 1, 2022)

* fix permissions on import

## 0.8.2 (October 10, 2021)

* updated codebase for PF2e 2.15. 

## 0.8.1 (August 21, 2021)

* update for 0.8.9 compatability
* introduced compatability with http instead of https (should work with both)

## 0.8.0 (August 11, 2021)

* updated codebase for PF2e 2.11. All users are required to upgrade as there are breaking changes

## 0.7.5 (July 20, 2021)

* fixed bug that would export characters to herovault that weren't supposed to be

## 0.7.4 (July 3, 2021)

* removed extraneous code

## 0.7.3 (July 3, 2021)

* fixed a bug that would export the PC to herovault even when the export to herovault box was unchecked.
* fixed a bug triggered by importing PC over an existing PC

## 0.7.2 (June 30, 2021)

* version bump to fix bad commit

## 0.7.1 (June 30, 2021)

* fixed the connector I rewrote. forgot to include the change 

## 0.7.0 (June 30, 2021)

* rewrote the connectors between hlo importer and herovault to use native api calls instead of janky crap

## 0.6.2 (June 30, 2021)

* revert previous change

## 0.6.1 (June 30, 2021)

* change relative paths to absolute for imports

## 0.6.0 (June 28, 2021)

* This module now integrates with HeroVau.lt and I highly recommend you install it, too!
* upped compatible version to 0.8.8
* prevent herolab button from showing if herovault is present and active

## 0.5.3 (June 23, 2021)

* fixed HLO importer showing up on non-character sheets
* cleaned up some code

## 0.5.2 (June 22, 2021)

* support for foundry 0.8.7

## 0.5.1 (June 18, 2021)

* minify the javascript
* added function in build code to ensure debug is never deployed

## 0.5.0 (June 3, 2021)

* Support for foundry 0.8.6+ only

## 0.4.1 (May 15, 2021)

* Fixed incompatability with the Foundry native app (thanks @Drental)

## 0.4.0 (May 12, 2021)

* Feats that have effects attached to them are now applied to the PC upon import.
* New tokens will have the appropriate actor ID

## 0.3.4 (May 5, 2021)

* Fix minor error in console output
* Added a setting to enable/disable debug output so source code editing wouldn't be required.

## 0.3.3 (Apr 30, 2021)

* Method implemented in 0.3.2 to prevent module from being loaded doesn't quite work, even though it should according to the documentation. Added a check in the code to prevent it from working outside of pf2e.

## 0.3.2 (Apr 30, 2021)

* prevent module from being loaded in other game systems (thanks wildj79)

## 0.3.1 (Apr 28, 2021)

* fix bug that was preventing error messages from showing

## 0.3.0 (Apr 28, 2021)

* add hlo importer and gamesystem version to js
* add color to console logging
* add hlo importer and gamesystem version to requests to check for compatability breaking features

## 0.2.5 (Mar 12, 2021)

* update to support PF2e 1.11.13

## 0.2.4 (Mar 01, 2021)

* add support for bug reporter module

## 0.2.3 (Feb 14, 2021)

* fix cancel button not working

## 0.2.2 (Jan 4, 2021)

* disable debug mode

## 0.2.1 (Jan 3, 2021)

* Made a proper release

## 0.2.0 (Jan 3, 2021)

* Added support for GMs to use their own User Token instead of my User Token (default). This value can be set through the module settings page. It is currently optional. I expect it will be mandatory at some time in the future.
* Added rudamentary error handling

## 0.1.2 (Jan 3, 2021)

* Change function names; I think they were possibly conflicting with Import from Pathbuilder 2e
* add debug flag to enable debug output to console

## 0.1.1 (Jan 2, 2021)

* Change Import icon to flask to imitate the flask that HLO uses for it's favicon. 
* Changed the menu title to HLO (from Import from HLO) to save some space. Title bars get pretty crowded if you have a lot of other modules that use that space.
* Prevent Import button from showing up on anything other than character sheets

## 0.1.0 (Jan 2, 2021)

* Initial Release

