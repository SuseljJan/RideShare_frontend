import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiAccessService} from './api-access.service';
import {Coordinates} from '../models/angular-models/coordinates';
import {Location} from '../models/api-models/location';
import {Address} from '../models/angular-models/address';
import {BaseUris} from '../common/base-uris';
import {TransportRequestPost} from '../models/api-models/transport-request-post';
import {TransportPost} from '../models/api-models/transport-post';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(
    private apiAccess: ApiAccessService
  ) {
  }

  public addressToCoordinates(address: Address): Promise<Location> {
      console.log('geo', address);
      return this.apiAccess.get<any>('/search/', false, {
        city: (address.city || ''),
        country: (address.country || ''),
        street: (address.streetNumber || '') + ' ' + (address.street || ''),
        postalcode: address.postCode || '',
        state: address.state || '',
        format: 'json',
        addressdetails: 1,
        limit: 1
      }, null, BaseUris.Nominatim)
        .toPromise()
        .then(result => {
          console.log(result);
          return new Location(
            result[0].lat,
            result[0].lon,
            result[0].address.house_number,
            result[0].address.road,
            result[0].address.city,
            result[0].address.country,
            result[0].address.postcode,
            result[0].address.state
          );
        })
        .catch(error => {
          return Promise.reject(error);
        });
  }

  public coordinatesToAddress(coordinates: Coordinates): Promise<Location> {
    console.log('COORDINATESTOPADDRESS CALLED');
    return this.apiAccess.get<any>('/reverse/', false, {
      lat: coordinates.lat,
      lon: coordinates.lng,
      format: 'json'
    }, null, BaseUris.Nominatim)
      .toPromise()
      .then(result => {
        return new Location(
          result.lon,
          result.lat,
          result.address.house_number,
          result.address.road,
          result.address.city,
          result.address.country,
          result.address.postcode,
          result.address.state
        );
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }


  public locationModelToAddressModel(addressModel: Location): Address {
    return new Address(
      addressModel.streetNumber,
      addressModel.street,
      addressModel.city,
      addressModel.country,
      addressModel.postalCode,
      addressModel.state
    );
  }

   public parseStartAndEndIfNecessary(transport: TransportPost|TransportRequestPost, needToParseStartLocation: boolean, needToParseEndLocation: boolean, callback: (transport) => void): any {
     if (needToParseStartLocation && needToParseEndLocation) {
       // TODO check if it actually works
       Promise.all([
         this.addressToCoordinates(this.locationModelToAddressModel(transport.startLocation)),
         this.addressToCoordinates(this.locationModelToAddressModel(transport.endLocation))
       ]).then((result: any[]) => {
         transport.startLocation = result[0];
         transport.endLocation = result[1];

         callback(transport);
       });
     } else if (needToParseStartLocation) {
       this.addressToCoordinates(
         this.locationModelToAddressModel(transport.startLocation)
       ).then(result => {
         transport.startLocation = result;

         callback(transport);
       });
     } else if (needToParseEndLocation) {
       this.addressToCoordinates(
         this.locationModelToAddressModel(transport.endLocation)
       ).then(result => {
         transport.endLocation = result;
         callback(transport);
       });
     } else {
       callback(transport);
     }

   }


}
