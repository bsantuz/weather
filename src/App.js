import React from 'react'
import Api from './services/api'
import weather from './component/weather'

let citys = [];

Api(
  "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome", 
  (e) =>{
      e.forEach(el => {
        citys.push(el.nome)
    });
  }
);

function App() {
  const [nameCitys, setnameCitys] = React.useState("") ;
  const [inputCity, setinputCity] = React.useState("");
  const [weatherData, setweatherData] = React.useState("");
  const [bg, setbg] = React.useState("");

  function filterCitys(city){
    return citys.filter((v) =>{
      return v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > -1;
    })
  }

  const handleFilter = (search) =>{
    setinputCity(search.target.value);

    if(citys && search.target.value.length >2){

      let f = filterCitys(search.target.value);
      
      let li = f.map((currElement, index) => {
        return (
            <li key= {index} > 
              <button onClick={()=>{
                setinputCity(currElement);
                setnameCitys("");
              }} className="btn w-100 text-start" >{currElement}</button>
            </li>
        )
      })

      setnameCitys(<ul className="list-unstyled d-flex flex-column p-3 mt-3 border overflow-auto bg-light" style = {{maxHeight: 300, zIndex:2}}>{li}</ul>);
    }else{
      setnameCitys("");
    }
  }
  
  const handleSearch = ()=>{
    let checkCity = filterCitys(inputCity);
    let checkCityEqual = checkCity.filter((e)=>{
      return e.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") === inputCity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    })
    if(checkCityEqual.length > 0){
      console.log(checkCityEqual[0]);
      setnameCitys("");

      Api(
        `https://api.weatherbit.io/v2.0/current?key=01c486ba9ed44f84934735a6789594d9&lang=pt&units=M&city=${checkCityEqual[0]}`, 
        (e)=>{
          console.log(e.data[0]);
          setweatherData(weather(e));

          switch (e.data[0].weather.code) {
            case 800:
            case 801:
            case 802:
              setbg("./img/day.png");
              break;
            default:
              setbg("./img/rain.png");
              break;
          }

        }
      )
    }else{
      alert("digite um endere??o valido");
    }

  }

  return (
    <React.Fragment>

    <div id="bg" className="vw-100 vh-100 position-fixed top-0" style = {{ zIndex:-2, backgroundImage: `url(${bg})`, backgroundRepeat: "noRepeat", backgroundSize: "cover"}}></div>

    <div className="container-sm d-flex mt-5 justify-content-center">
        <input ip="search" className="form-control me-3" type="text" onChange = { handleFilter } value={inputCity} placeholder="ex. Rio de Janeiro" style = {{maxWidth: 250,}}/>
        <button onClick = { handleSearch } className="btn btn-primary d-flex align-items-center" >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill me-2" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          </svg>
          Pesquisar</button>
    </div>

    <div className="container-sm position-relative" style = {{ zIndex:2, maxWidth:400 }}>
      { nameCitys}
    </div>
    {weatherData}
    </React.Fragment>
  );
}


export default App;
