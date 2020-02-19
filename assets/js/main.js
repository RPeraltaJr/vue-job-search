const vm = new Vue({
    el: '#root',
    data: {       
        jobs: [],
        categories: [],
        locations: [],
        keyword: '',
        category: '',
        location: '',

        page: 1,
        perPage: 10,
        pages: [],
        filteredJobs: [], // needed to create updated pagination when filters are active

        displayNumber: 0,
        interval: false,
    },
    methods: {
      setPages() {
        let numberOfPages = Math.ceil(this.filteredJobs.length / this.perPage);
        this.pages = []; // set array to empty to recalculate
        for(let index = 1; index <= numberOfPages; index++) {
          this.pages.push(index);
        }
      },
      paginate(jobs) {
        let page = this.page;
        let perPage = this.perPage;
        let from = (page * perPage) - perPage;
        let to = (page * perPage);
        return jobs.slice(from, to);
      },
      resetPagination() {
        this.page = 1; 
      }
    },
    computed: {
    	filteredByAll() {
        this.filteredJobs = getByLocation(getByCategory(getByKeyword(this.jobs, this.keyword), this.category), this.location);
        return this.paginate(this.filteredJobs)
      },
      number(){
        clearInterval(this.interval);
          if(this.filteredJobs.length == this.displayNumber){
            return; 
          }
          this.interval = window.setInterval(function(){
            if(this.displayNumber != this.filteredJobs.length){
              let change = (this.filteredJobs.length - this.displayNumber) / 10;
              change = change >= 0 ? Math.ceil(change) : Math.floor(change);
              this.displayNumber = this.displayNumber + change;
            }
          }.bind(this), 20);
      }
    },
    watch: {
      filteredByAll() {
        this.setPages();
        this.number();
        this.displayNumber = this.filteredJobs.length ? this.filteredJobs.length : 0;
      },
    },
    created() {
      // const url = "https://my-json-server.typicode.com/RPeraltaJr/jobs-api/results";
      const url = "./data/jobs.json";
      fetch(url)
        .then((response) => response.json())
        .then(data => {
          // add jobs to array
          this.jobs = data;

          // add job categories to array
          this.jobs.map((job) => {
            // add category if it doesn't exist in array
            if(this.categories.indexOf(job.category) === -1) {
              this.categories.push(job.category);
            }
          });

          // add job locations to array
          this.jobs.map((job) => {
            // add location if it doesn't exist in array
            if(this.locations.indexOf(job.location) === -1) {
              this.locations.push(job.location);
            }
          });
        });
    }
});

function getByKeyword(list, keyword) {
  const search = keyword.trim().toLowerCase()
  if (!search.length) return list
  let hasNumber = /\d/;
  return list.filter(item => item.title.toLowerCase().indexOf(search) > -1 || item.id == search)
}

function getByCategory(list, category) {
  if (!category) return list
  return list.filter(item => item.category === category)
}

function getByLocation(list, location) {
  if (!location) return list
  return list.filter(item => item.location === location)
}