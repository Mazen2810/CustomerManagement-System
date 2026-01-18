export interface Customer {
    id : number,
    brandName : string,
    brandLogoUrl : string,
    companyName : string,
    taxNumber : string,
    contactPersonName : string,
    contactPersonPhone : string,
    companyAddress : string,
    shopLocation : string,
    images : string[],
    startDate : Date,
    endDate : Date
    customerStatus: 'Expired' | 'Active'
}
