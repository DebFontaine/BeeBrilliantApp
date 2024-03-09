import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

export interface CategoryLevelFilterData
{
  textFilterValue: string;
  selectedCategoryOption: string;
  selectedLevelOption: string;
}

@Component({
  selector: 'category-level-filter',
  templateUrl: './category-level-filter.component.html',
  styleUrls: ['./category-level-filter.component.css']
})
export class CategoryLevelFilterComponent {
  @Output() applyFiltersEvent =  new EventEmitter<CategoryLevelFilterData>();
  @Output() applyTextFilterEvent =  new EventEmitter<string>();
  @Output() resetFilterEvent =  new EventEmitter<string>();
  @Input() showTextFilter:boolean = true;
  
  selectedCategoryOption: string = '';
  selectedLevelOption: string = '';
  textFilterValue: string = '';
  filterApplied: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.textFilterValue = filterValue.trim().toLowerCase();
    this.applyTextFilterEvent.emit(this.textFilterValue)
  }

  onCategorySelectionChange(event: MatSelectChange) {
    this.selectedCategoryOption = event.value;
  }
  onLevelSelectionChange(event: MatSelectChange) {
    this.selectedLevelOption = event.value;
  }

  applyFilters(){
    this.applyFiltersEvent.emit({ textFilterValue: this.textFilterValue, selectedCategoryOption: this.selectedCategoryOption,
      selectedLevelOption: this.selectedLevelOption  });
    this.filterApplied = true;
  }
  resetFilters(){
    this.selectedCategoryOption = '';
    this.selectedLevelOption = '';
    this.textFilterValue = '';
    this.filterApplied = false;
    this.resetFilterEvent.emit("reset")
  }

}
