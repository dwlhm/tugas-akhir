import { Link } from "@tanstack/react-router"

import { Open } from "../assets/open"

export const DataCard = (props: {
  data: any
}) => {
  const item = props.data
  return(
  <>
    <h2 className="card-title">{item.name}</h2>
    <div className="sensor-value">
      <div>
        <p className="title">PM 1.0</p>
        <p className="value">{item.value["1"]}<span>μg/m³</span></p>
      </div>
      <div>
        <p className="title">PM 2.5</p>
        <p className="value">{item.value["2"]}<span>μg/m³</span></p>
      </div>
      <div>
        <p className="title">PM 10</p>
        <p className="value">{item.value["0"]}<span>μg/m³</span></p>
      </div>
      {
        item.value["3"] && <div>
          <p className="title">PM 100</p>
          <p className="value">{item.value["3"]}
            <span>μg/m³</span>        
          </p>
        </div>
      }
      {
        item.value["h"] && <div>
          <p className="title">Humidity</p>
          <p className="value">{item.value["h"]}
            <span>%</span>        
          </p>
        </div>
      }
      {
        item.value["t"] && <div>
          <p className="title">Suhu</p>
          <p className="value">{item.value["t"]}
            <span>℃</span>        
          </p>
        </div>
      }
      {
        item.value["v"] && <div>
          <p className="title">Kecepatan Angin</p>
          <p className="value">{item.value["v"]}
            <span>m/s</span>        
          </p>
        </div>
      }
      {
        item.value["a"] && <div>
          <p className="title">Arah Angin</p>
          <p className="value">{item.value["a"]}
            <span>°</span>        
          </p>
        </div>
      }
        <Link to="/$deviceId" params={{ deviceId: item.id }}>
          <Open />
        </Link>

    </div>
  </>
  )
}

export const DataCardSecured = (props: {
  data: any
}) => {
  const item = props.data
  return(
  <>
    <h2 className="card-title">{item.name}</h2>
    <div className="sensor-value">
      <div>
        <p className="title">PM 1.0</p>
        <p className="value">{item.value["1"]}<span>μg/m³</span></p>
      </div>
      <div>
        <p className="title">PM 2.5</p>
        <p className="value">{item.value["2"]}<span>μg/m³</span></p>
      </div>
      <div>
        <p className="title">PM 10</p>
        <p className="value">{item.value["0"]}<span>μg/m³</span></p>
      </div>
      {
        item.value["3"] && <div>
          <p className="title">PM 100</p>
          <p className="value">{item.value["3"]}
            <span>μg/m³</span>        
          </p>
        </div>
      }
      {
        item.value["h"] && <div>
          <p className="title">Humidity</p>
          <p className="value">{item.value["h"]}
            <span>%</span>        
          </p>
        </div>
      }
      {
        item.value["t"] && <div>
          <p className="title">Suhu</p>
          <p className="value">{item.value["t"]}
            <span>℃</span>        
          </p>
        </div>
      }
      {
        item.value["v"] && <div>
          <p className="title">Kecepatan Angin</p>
          <p className="value">{item.value["v"]}
            <span>m/s</span>        
          </p>
        </div>
      }
      {
        item.value["a"] && <div>
          <p className="title">Arah Angin</p>
          <p className="value">{item.value["a"]}
            <span>°</span>        
          </p>
        </div>
      }
        <Link to="/node/$nodeId" params={{ nodeId: item.id }}>
          <Open />
        </Link>

    </div>
  </>
  )
}