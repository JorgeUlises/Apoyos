using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Acciones.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace Acciones.Controllers
{
    public class ReportesController : Controller
    {
        // GET: ReportesController
        private readonly dbAccionesContext _context;

        public ReportesController(dbAccionesContext context)
        {
            _context = context;
        }

        public ActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            return View();
        }

        // GET: ReportesController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ReportesController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ReportesController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ReportesController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ReportesController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ReportesController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ReportesController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        public ActionResult Cumples()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            int numMes = DateTime.Now.Month;
            ViewBag.JavaScriptFunction = string.Format("SeleccionaMes(" + numMes + ");");
            return View();
        }

        public ActionResult SolXSemana()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            int LegislaturaId = 0;
            int DiputadoId = 8;
            int ResponsableId = -1;

            LegislaturaId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();

            int numMes = DateTime.Now.Month;
            ViewBag.JavaScriptFunction = string.Format("NumeroSolicitudesXsemana(" + LegislaturaId + "," + DiputadoId + "," + ResponsableId + ");");

            List<SelectListItem> Lusr = _context.Usuarios.Where(u => u.DiputadoId == 8 && u.RolId == 3).Select(u => new SelectListItem
            {
                Value = u.UsuarioId.ToString(),
                Text = u.Nombre
            }).ToList();

            Lusr.Insert(0, new SelectListItem() { Value = "-1", Text = "TODO" });
            Lusr.Insert(1, new SelectListItem() { Value = "0", Text = "Sin Asignar" });

            ViewData["UsuariosResponsables"] = Lusr;

            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegislaturaId"] = LLegis;

            return View();
        }


        public ActionResult IntegrantesAsociacion() 
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            int numMes = DateTime.Now.Month;
            ViewBag.JavaScriptFunction = string.Format("FiltraIntegrantesAsociacion();");
            return View();
        }

        public Int32 numeroArchivosXeventoId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT NombreCompleto, Latitud, Longitud, Afin FROM Ciudadanos WHERE Latitud IS NOT NULL  AND Longitud IS NOT NULL AND CiudadanoID!=6";
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }


        public IActionResult UbicacionCiudadanos()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            string markers = "[";
            string stm = "";
            //string conString = @"Data Source=.\SQL2017;Initial Catalog=AjaxSamples;integrated security=true";
            //SqlCommand cmd = new SqlCommand("SELECT * FROM Locations");
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            stm = "SELECT C.NombreCompleto AS NombreCompleto, C.Latitud AS Latitud, C.Longitud AS Longitud, C.Afin AS Afin, C.telefono AS telefono, C.URL AS URL, C.CiudadanoId AS CiudadanoId, PA.Nombre AS partido, PA.Logotipo AS logo, C.DDigital AS digital";
            stm += ", ISNULL(CO.NombreColonia,'') AS NombreColonia, ISNULL(CA.NombreCalle,'') AS NombreCalle, ISNULL(C.NumExterior,'') AS NumExterior, C.CP AS CP ";
            stm += ", (SELECT COUNT(CiudadanoID) FROM IntegrantesAsociacion WHERE CiudadanoID=C.CiudadanoId AND Representante=1) as lider ";
            stm += " FROM Ciudadanos AS C";
            stm += " LEFT JOIN Colonias AS CO ON CO.ColoniaID = C.ColoniaID ";
            stm += " LEFT JOIN Calles AS CA ON CA.CalleID = C.CalleID ";
            stm += " LEFT JOIN CatPartidos AS PA ON PA.PartidoID = C.PartidoID ";
            stm += " WHERE Latitud IS NOT NULL  AND Longitud IS NOT NULL";
            //SqlCommand cmd = new SqlCommand(stm, conn_p);

            //using (SqlConnection con = new SqlConnection(conString))
            using (SqlCommand cmd = new SqlCommand(stm, conn_p))
            {
                //cmd.Connection = con;
                //con.Open();
                using (SqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        markers += "{";
                        markers += string.Format("'title': '{0}',", sdr["NombreCompleto"]);
                        markers += string.Format("'lat': '{0}',"  , sdr["Latitud"]);
                        markers += string.Format("'lng': '{0}',"  , sdr["Longitud"]);
                        //markers += string.Format("'lat': '{0}',", Decimal.Parse((string)sdr["Latitud"]));
                        //markers += string.Format("'lng': '{0}',", Decimal.Parse((string)sdr["Longitud"]));
                        
                        markers += string.Format("'afin': '{0}',"  , sdr["Afin"]);
                        markers += string.Format("'telefono': '{0}',", sdr["telefono"]);
                        markers += string.Format("'foto': '{0}',"  , sdr["URL"]);
                        markers += string.Format("'ciudadanoId': '{0}',", sdr["CiudadanoId"]);
                        markers += string.Format("'colonia': '{0}',", sdr["NombreColonia"]);
                        markers += string.Format("'calle': '{0}',", sdr["NombreCalle"]);
                        markers += string.Format("'numero': '{0}',", sdr["NumExterior"]);
                        markers += string.Format("'cp': '{0}',", sdr["CP"]);
                        markers += string.Format("'partido': '{0}',", sdr["partido"]);
                        markers += string.Format("'digital': '{0}',", sdr["digital"]);
                        markers += string.Format("'lider': '{0}',", sdr["lider"]);
                        markers += string.Format("'logo': '{0}',", sdr["logo"]);
                        markers += "},";
                    }
                }
                conn_p.Close();
            }

            markers += "];";
            ViewBag.Markers = markers;
            ViewBag.JavaScriptFunction = string.Format("initialize_mapCiudadanoUbicacion();");
            return View();
        }


        public string SeleccionaUbicacionCiudadanos(int afin, int panista, int ddigital, int lider)
        {
            string markers = "[";
            string stm = "";
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            stm = "SELECT C.NombreCompleto AS NombreCompleto, C.Latitud AS Latitud, C.Longitud AS Longitud, C.Afin AS Afin, C.telefono AS telefono, C.URL AS URL, C.CiudadanoId AS CiudadanoId, PA.Nombre AS partido, PA.Logotipo AS logo, C.DDigital AS digital";
            stm += ", ISNULL(CO.NombreColonia,'') AS NombreColonia, ISNULL(CA.NombreCalle,'') AS NombreCalle, ISNULL(C.NumExterior,'') AS NumExterior, C.CP AS CP ";
            stm += ", (SELECT COUNT(CiudadanoID) FROM IntegrantesAsociacion WHERE CiudadanoID=C.CiudadanoId AND Representante=1) AS lider ";
            stm += " FROM Ciudadanos AS C";
            stm += " LEFT JOIN Colonias AS CO ON CO.ColoniaID = C.ColoniaID ";
            stm += " LEFT JOIN Calles AS CA ON CA.CalleID = C.CalleID ";
            stm += " LEFT JOIN CatPartidos AS PA ON PA.PartidoID = C.PartidoID ";
            stm += " WHERE Latitud IS NOT NULL  AND Longitud IS NOT NULL ";

            if (afin == 1) { stm += " AND C.Afin = 1 "; }
            if (ddigital == 1) { stm += " AND C.DDigital = 1 "; }
            if (panista == 1) { stm += " AND PA.Nombre = 'PAN' "; }
            if (lider == 1) { stm += " AND (SELECT COUNT(CiudadanoID) FROM IntegrantesAsociacion WHERE CiudadanoID = C.CiudadanoId AND Representante = 1) > 0 "; }

            using (SqlCommand cmd = new SqlCommand(stm, conn_p))
            {
                using (SqlDataReader sdr = cmd.ExecuteReader())
                {
                    while (sdr.Read())
                    {
                        markers += "{";
                        markers += string.Format("'title': '{0}',", sdr["NombreCompleto"]);
                        markers += string.Format("'lat': '{0}',", sdr["Latitud"]);
                        markers += string.Format("'lng': '{0}',", sdr["Longitud"]);
                        markers += string.Format("'afin': '{0}',", sdr["Afin"]);
                        markers += string.Format("'telefono': '{0}',", sdr["telefono"]);
                        markers += string.Format("'foto': '{0}',", sdr["URL"]);
                        markers += string.Format("'ciudadanoId': '{0}',", sdr["CiudadanoId"]);
                        markers += string.Format("'colonia': '{0}',", sdr["NombreColonia"]);
                        markers += string.Format("'calle': '{0}',", sdr["NombreCalle"]);
                        markers += string.Format("'numero': '{0}',", sdr["NumExterior"]);
                        markers += string.Format("'cp': '{0}',", sdr["CP"]);
                        markers += string.Format("'partido': '{0}',", sdr["partido"]);
                        markers += string.Format("'digital': '{0}',", sdr["digital"]);
                        markers += string.Format("'lider': '{0}',", sdr["lider"]);
                        markers += string.Format("'logo': '{0}',", sdr["logo"]);
                        markers += "},";
                    }
                }
                conn_p.Close();
            }

            markers += "];";
            //ViewBag.Markers = markers;
            return markers;
        }

        public IActionResult Prueba()
        {
            return View();
        }
    }
}

