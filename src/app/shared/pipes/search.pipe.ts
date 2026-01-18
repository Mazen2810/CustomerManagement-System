import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {

  transform(data: any[], text: string): any[] {
    // filter data according to brand name
    return data.filter((item) => {
       return item.brandName.toLowerCase().includes(text.toLowerCase().trim())
             
              
    })
  }

}
