/* eslint-disable linebreak-style */

import {run} from '../src/index';


describe('Run', function() {
  for (let i = 0; i < 50; i++) {
    it('should send success data from API post to console.log', function(done) {
      spyOn(console, 'log');
      run()
          .then(() => {
            expect(console.log).toHaveBeenCalledWith(true);
            done();
          });
    });
  }
});
