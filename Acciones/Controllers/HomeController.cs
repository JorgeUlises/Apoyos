using Acciones.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Acciones.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly dbAccionesContext _context;

        public HomeController(ILogger<HomeController> logger, dbAccionesContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Inicio()
        {
            return View("RegistroUsr");
        }

        public IActionResult Index()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // will give the user's userId

            if (User.Identity.IsAuthenticated)
            {

                var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
                List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
                var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
                selected.Selected = true;
                ViewData["LegislaturaId"] = LLegis;

                ViewBag.JavaScriptFunction = string.Format("Resumen(" + LegId + ", 0, 0);");
                return View();
            }
            else
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
        }

        public IActionResult LoginUser(string clave, string contrasena)
        {
            TokenProvider _tokenProvider = new TokenProvider(_context);
            var userToken = _tokenProvider.LoginUser(clave.Trim(), contrasena.Trim());
            if (userToken != null)
            {
                HttpContext.Session.SetString("JWToken", userToken);
                return Redirect("/Apoyo/Home/Index");
            }
            return Redirect("/Apoyo/Home/Inicio");
        }

        public IActionResult Logoff()
        {
            HttpContext.Session.Clear();
            return Redirect("/Apoyo/Home/Inicio");
        }

        public IActionResult NoPermission()
        {
            return View();
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public IActionResult ResumenGestiones()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            ViewBag.JavaScriptFunction = string.Format("resumenGestion_Cat_Subcat_Estatus(" + LegId + ",0,0);");
            return View();
        }

        //[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult ResumenApoyos()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            ViewBag.JavaScriptFunction = string.Format("resumenApoyo_Cat_Subcat_Estatus(" + LegId + ",0,0);");
            return View();
        }

        /*******************************************************************
            Obtiene el Prefijo
        ********************************************************************/
        public List<string> prefijo()
        {
            string stm = "";
            
            List<string> referenciaList = new List<string>();
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();

            stm = "SELECT PATH FROM [dbo].[Referencia]";
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            try
            {
                SqlDataReader query = cmd_p.ExecuteReader();

                if (query.HasRows)
                {
                    while (query.Read())
                    {
                        referenciaList.Add(query.GetString(0).Trim());
                    }
                }
                else
                {
                    referenciaList.Add("");
                }
                query.Close();
                conn_p.Close();
                return referenciaList;
            }
            catch (DbUpdateConcurrencyException)
            {
                conn_p.Close();
                return referenciaList;
            }
        }

    }
}
