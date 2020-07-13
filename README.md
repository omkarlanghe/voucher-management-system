# Voucher Management System
A simple and basic voucher management system written in node.

## Voucher format
* Voucher Format Type: String, Prefix - “VCD”, Suffix- 10 Random strings and numbers.**<br>
* Voucher PIN Type: String, Format: 5 randomly generated strings.**<br>

## Voucher Redemption Rule
* A voucher can be redeemed only by the assigned email id.
* A voucher code should be submitted along with the PIN to redeem it.
* A voucher code is only valid for 24 hours from the time of generation.
* A voucher code can only be utilised partially upto 5 times. Ex: Voucher code worth Rs 1000 can be used 5 times(400, 100, 200, 200, 100).
* If partially redeemed, the next attempt cannot be done for the next 10 minutes.Ex: For a voucher Rs1000, if a person redeems 500Rs at 11:10 AM, then he can use it again only on 11.20 AM

## Voucher Generation API
* Authentication(JWT) should be provided to consume the API.
* A Voucher code should be generated along with a PIN.
* A Voucher Code is generated for an email ID. On successful generation of the voucher, an email should be sent to the respective email address.
* Manage a voucher log, where all the details of the voucher should be stored(Code, PIN(encrypted), email, generation time, usage activity, status).
* A response has to be sent containing the voucher details.

## Voucher Redeem API
* A Voucher can only be redeemed by the assigned email id.
* A Voucher can be redeemed only if a correct pin has been sent.
* Voucher Redemption should follow all the Redemption Rules mentioned above.
* Update the voucher logs.
* A response has to be sent containing the redemption details and voucher details.

## Get Vouchers API
* An api which will retrieve the voucher details based on the filters.
* Filters: Generation time(from and to timestamps) filter, Status filter(redeemed, partially redeemed, active), Email ID filter(email address for which a voucher was generated)

## Folder Structure
```
  voucher-management-system/
      configurations/
          config.js
          mongo.config.js
          passport.js
      controllers/
          user.js
          voucher.js
      database/
          user.js
          voucher.js
      services/
          service.mail.js
      utils/
          error.js
          mongo.util.js
      webServer/
          routes.js
          wsUser.js
          wsVoucher.js
      .eslintrc.js
      .gitignore
      package.json
      package-lock.js
      README.md
      server.js
```
