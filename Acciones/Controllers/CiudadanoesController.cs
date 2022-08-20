using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Acciones.ViewModel;
using Microsoft.Data.SqlClient;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Data;
using ClosedXML.Excel;

namespace Acciones.Controllers
{
    public class CiudadanoesController : Controller
    {
        private readonly dbAccionesContext _context;

        public CiudadanoesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Ciudadanoes
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            //var dbAccionesContext = _context.Ciudadanos.Include(c => c.Calle).Include(c => c.Colonia);

            List<SelectListItem> Lmunicipios = new SelectList(_context.Municipios, "MunicipioId", "Nombre").ToList();
            Lmunicipios.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["Municipio"] = Lmunicipios;

            List<SelectListItem> Lpartidos = new SelectList(_context.CatPartidos, "PartidoId", "Nombre").ToList();
            Lpartidos.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["Partidos"] = Lpartidos;


            ViewBag.JavaScriptFunction = string.Format("FiltraCiudadanos();");
            //return View(await dbAccionesContext.ToListAsync());
            return View();
        }

        // GET: Ciudadanoes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ciudadano = await _context.Ciudadanos
                .Include(c => c.Calle)
                .Include(c => c.Colonia)
                .FirstOrDefaultAsync(m => m.CiudadanoId == id);
            if (ciudadano == null)
            {
                return NotFound();
            }

            return View(ciudadano);
        }

        // GET: Ciudadanoes/DetalleCiudadano/5
        public IActionResult DetalleCiudadano(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            ViewBag.JavaScriptFunction = string.Format("muestraDetalleCiudadano(" + id + ");");
            return View();
        }

        // GET: Ciudadanoes/Create
        public IActionResult Create()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle");
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia");
            
            List<SelectListItem> Lcat = new SelectList(_context.Municipios, "MunicipioId", "Nombre").ToList();
            Lcat.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["Municipio"] = Lcat;

            List<SelectListItem> Lpartidos = new SelectList(_context.CatPartidos, "PartidoId", "Nombre").ToList();
            Lpartidos.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["Partidos"] = Lpartidos;

            return View();
        }

        // POST: Ciudadanoes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CiudadanoId,Paterno,Materno,Nombre,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Partido,TipoMiembro,Distrito,Seccion,FechaNacimiento,Estatus,Genero,Notas,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId")] Ciudadano ciudadano)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (ModelState.IsValid)
            {
                _context.Add(ciudadano);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", ciudadano.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", ciudadano.ColoniaId);

            //List<SelectListItem> Lcat = new SelectList(_context.Municipios, "MunicipioId", "Nombre").ToList();
            //Lcat.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            //ViewData["Municipio"] = Lcat;
            ViewData["Municipio"] = new SelectList(_context.Municipios, "MunicipioId", "Nombre", ciudadano.MunicipioId);
            return View(ciudadano);
        }

        // GET: Ciudadanoes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var ciudadano = await _context.Ciudadanos.FindAsync(id);
            if (ciudadano == null)
            {
                return NotFound();
            }

            if (ciudadano.INE_URL == null)
            {
                ciudadano.INE_URL = "";
            }

            if (ciudadano.ArchivoINE_BD == null)
            {
                ciudadano.ArchivoINE_BD = "";
            }

            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", ciudadano.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", ciudadano.ColoniaId);
            ViewData["NombreCalle"] = _context.Calles.Where(c=>c.CalleId==ciudadano.CalleId).Select(c=>c.NombreCalle).FirstOrDefault();
            ViewData["NombreColonia"] = _context.Colonias.Where(c => c.ColoniaId == ciudadano.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault();
            ViewData["NombreColoniaPub"] = _context.Colonias.Where(c => c.ColoniaId == ciudadano.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault();
            //ViewData["Municipio"] = new SelectList(_context.Municipios, "MunicipioId", "Nombre", ciudadano.MunicipioId);

            List<SelectListItem> LstMunicipios = new SelectList(_context.Municipios, "MunicipioId", "Nombre").ToList();
            LstMunicipios.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["Municipio"] = LstMunicipios;


            List<SelectListItem> LstPartidos = new SelectList(_context.CatPartidos, "PartidoId", "Nombre").ToList();
            LstPartidos.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["Partidos"] = LstPartidos;

            List<SelectListItem> LstTipoPublicidad = new SelectList(_context.TipoPublicidad, "TipoPublicidadId", "Nombre").ToList();
            LstTipoPublicidad.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["TipoPublicidad"] = LstTipoPublicidad;

            List<SelectListItem> LstOrigenPublicidad = new SelectList(_context.OrigenPublicidad, "OrigenPublicidadId", "Nombre").ToList();
            LstOrigenPublicidad.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["OrigenPublicidad"] = LstOrigenPublicidad;


            ViewBag.JavaScriptFunction = string.Format("ListaPublicidadCiudadano(" + id + ");");

            return View(ciudadano);
        }

        // POST: Ciudadanoes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CiudadanoId,Paterno,Materno,Nombre,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Email,Telefono,Partido,TipoMiembro,Distrito,Seccion,FechaNacimiento,Estatus,Genero,Notas,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistroId, INE_URL, ArchivoINE_BD")] Ciudadano ciudadano)
        {
            if (id != ciudadano.CiudadanoId)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (ciudadano.INE_URL == null)
            {
                ciudadano.INE_URL = "";
            }

            if (ciudadano.ArchivoINE_BD == null)
            {
                ciudadano.ArchivoINE_BD = "";
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(ciudadano);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CiudadanoExists(ciudadano.CiudadanoId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", ciudadano.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", ciudadano.ColoniaId);
            ViewData["Municipio"] = new SelectList(_context.Municipios, "MunicipioId", "Nombre", ciudadano.MunicipioId);

            

            return View(ciudadano);
        }

        // GET: Ciudadanoes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var ciudadano = await _context.Ciudadanos
                .Include(c => c.Calle)
                .Include(c => c.Colonia)
                .FirstOrDefaultAsync(m => m.CiudadanoId == id);
            if (ciudadano == null)
            {
                return NotFound();
            }

            return View(ciudadano);
        }

        // POST: Ciudadanoes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            try
            {
                var ciudadano = await _context.Ciudadanos.FindAsync(id);
                _context.Ciudadanos.Remove(ciudadano);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            catch {
                return RedirectToAction(nameof(MensajeCiudadano));
            }
        }

        public IActionResult MensajeCiudadano()
        {
            return View();
        }

        private bool CiudadanoExists(int id)
        {
            return _context.Ciudadanos.Any(e => e.CiudadanoId == id);
        }

        /************************************************************
            Inserta Nuevo Ciudadano
        *************************************************************/
        [HttpPost]
        public int InsertaNuevoCiudadano(string paterno, string materno, string nombre, string fechaNacimiento, string genero, int coloniaId, int calleId, string numExterior, string numInterior, int cp, string email, string telefono, string partido, string miembro, string seccion, string latitud, string longitud, string notas, string rfc, string curp, int cbCumple, int cbAfin, int cbRCasilla, int cbLNegra, int municipio, int partidoId, int cbDDigital)
        {
            if (BuscaPersonaXnombre(paterno, materno, nombre) > 0)       //  Verifica que no exista otra persona con el mismo nombre y apellidos
            {
                return 0;
            }

            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            int DiputadoId = 8;

            Ciudadano ciudadano = new Ciudadano();
            ciudadano.Paterno = paterno??"";
            ciudadano.Materno = materno??"";
            ciudadano.Nombre = nombre;
            ciudadano.ColoniaId = coloniaId;
            ciudadano.CalleId = calleId;
            ciudadano.NumExterior = numExterior;
            ciudadano.NumInterior = numInterior;
            ciudadano.Cp = cp;
            ciudadano.Email = email??"";
            ciudadano.Telefono = telefono??"";
            ciudadano.Partido = partido==null?"":partido;
            ciudadano.TipoMiembro = miembro==null?"":miembro;
            ciudadano.Distrito = "V";
            ciudadano.Seccion = seccion;
            ciudadano.FechaNacimiento = fechaNacimiento==null? new DateTime(1900, 1, 1): Convert.ToDateTime(fechaNacimiento + " 00:00:00");
            ciudadano.Estatus = 1;
            ciudadano.Genero = genero;
            ciudadano.Notas = notas;
            ciudadano.Campo1 = "";
            ciudadano.Campo2 = 0;
            ciudadano.Latitud = latitud;
            ciudadano.Longitud = longitud;
            ciudadano.FechaRegistro = DateTime.Now;
            ciudadano.FechaUltimoCambio = DateTime.Now;
            ciudadano.UsuarioRegistroId = 1;
            ciudadano.NombreCompleto = nombre +" " +  paterno + " " + materno;
            ciudadano.DiputadoId = DiputadoId;
            ciudadano.RFC = rfc;
            ciudadano.CURP = curp;
            ciudadano.Afin = cbAfin;
            ciudadano.RCasilla = cbRCasilla;
            ciudadano.NoAfin = cbLNegra;
            ciudadano.recordarcumple = cbCumple;
            ciudadano.NombreArchivoBD = "avatar.png";
            ciudadano.URL = "/Archivos/PETICIONES/CIUDADANOS/avatar.png";
            ciudadano.MunicipioId = municipio;
            ciudadano.PartidoId = partidoId;
            ciudadano.DDigital = cbDDigital;


            try
            {
                _context.Ciudadanos.Add(ciudadano);
                _context.SaveChanges();

                if (ciudadano.CiudadanoId != 0)
                {
                    return ciudadano.CiudadanoId;

                }
                else
                {
                    Console.WriteLine("No se insertó en la BD el ciudadano");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar un ciudadano: {0}", e.Message);
                return -1;
            }
        }


        /************************************************************
            Actualiza Ciudadano
        *************************************************************/
        [HttpPost]
        public int ActualizaCiudadano(int ciudadanoId, string paterno, string materno, string nombre, string fechaNacimiento, string genero, int coloniaId, int calleId, string numExterior, string numInterior, int cp, string email, string telefono, string partido, string miembro, string seccion, string latitud, string longitud, string notas, string rfc, int cbCumple, string nombreArchivoBd, string url, string curp, int cbAfin, int cbRCasilla, int cbLNegra, int municipio, int partidoId, int cbDDigital )
        {

            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            if (ActualizaBuscaPersonaXnombre(ciudadanoId, paterno, materno, nombre) > 0)       //  Verifica que no exista otra persona con el mismo nombre y apellidos
            {
                return 0;
            }

            int DiputadoId = 8;

            Ciudadano ciudadano = new Ciudadano();
            ciudadano.CiudadanoId = ciudadanoId;
            ciudadano.Paterno = paterno;
            ciudadano.Materno = materno;
            ciudadano.Nombre = nombre;
            ciudadano.ColoniaId = coloniaId;
            ciudadano.CalleId = calleId;
            ciudadano.NumExterior = numExterior;
            ciudadano.NumInterior = numInterior;
            ciudadano.Cp = cp;
            ciudadano.Email = email;
            ciudadano.Telefono = telefono;
            ciudadano.Partido = partido == null ? "" : partido;
            ciudadano.TipoMiembro = miembro == null ? "" : miembro;
            ciudadano.Distrito = "V";
            ciudadano.Seccion = seccion;
            ciudadano.FechaNacimiento = fechaNacimiento == null ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaNacimiento + " 00:00:00");
            ciudadano.Estatus = 1;
            ciudadano.Genero = genero;
            ciudadano.Notas = notas;
            ciudadano.Campo1 = "";
            ciudadano.Campo2 = 0;
            ciudadano.Latitud = latitud;
            ciudadano.Longitud = longitud;
            //ciudadano.FechaRegistro = DateTime.Now;
            ciudadano.FechaUltimoCambio = DateTime.Now;
            ciudadano.UsuarioRegistroId = 1;
            ciudadano.NombreCompleto = nombre + " " + paterno + " " + materno;
            ciudadano.DiputadoId = DiputadoId;
            ciudadano.RFC = rfc;
            ciudadano.recordarcumple = cbCumple;
            ciudadano.NombreArchivoBD = nombreArchivoBd;
            ciudadano.URL = url;

            ciudadano.CURP = curp;
            ciudadano.Afin = cbAfin;
            ciudadano.RCasilla = cbRCasilla;
            ciudadano.NoAfin = cbLNegra;
            ciudadano.MunicipioId = municipio;
            ciudadano.PartidoId = partidoId;
            ciudadano.DDigital = cbDDigital;

            try
            {
                _context.Ciudadanos.Update(ciudadano);
                _context.SaveChanges();

                if (ciudadano.CiudadanoId != 0)
                {
                    return ciudadano.CiudadanoId;

                }
                else
                {
                    Console.WriteLine("No se Actualizó en la BD el ciudadano");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Actualizar un ciudadano: {0}", e.Message);
                return -1;
            }
        }

        /*******************************************************************
            Busca si existe una persona con el mismo nombre y apellidos
        ********************************************************************/
        public int ActualizaBuscaPersonaXnombre(int ciudadanoId, string paterno, string materno, string nombre)
        {
            var TotalRegistrosEncontrados = _context.Ciudadanos.Where(c => c.Paterno== paterno && c.Materno==materno && c.Nombre==nombre && c.CiudadanoId != ciudadanoId).Count();
            return TotalRegistrosEncontrados;
        }

        /*******************************************************************
            Busca si existe una persona con el mismo nombre y apellidos
        ********************************************************************/
        public int BuscaPersonaXnombre(string paterno, string materno, string nombre)
        {
            var TotalRegistrosEncontrados = _context.Ciudadanos.Where(c => c.Paterno == paterno && c.Materno == materno && c.Nombre == nombre).Count();
            return TotalRegistrosEncontrados;
        }


        /*************************************************************************************
         *  Buscar Ciudadano
         *************************************************************************************/
        public JsonResult BusquedaCiudadano(string term)
        {
            {
                var datosCiudadano = _context.Ciudadanos.Where(c => c.NombreCompleto.Contains(term)).Select(c => new { aNombreCiudadano = c.NombreCompleto, id = c.CiudadanoId }).ToList();
                return Json(datosCiudadano);
            }
        }


        /************************************************************
            Obtiene Todas los CIUDADANOS con Argumentos para WHERE
        *************************************************************/
        public IEnumerable<ObjetoCiudadano> ObtieneCiudadanos(int RegXpag, int offsetPeticiones, string Nombre, int MesCumple, string Colonia, string Calle, int CP, string Email, string Telefono, string Genero, int cumple, int Municipio, int BpartidoId, int Blider, int Bafin, int BrCasilla, int BlNegra, int BdDigital)
        {
            IEnumerable<ObjetoCiudadano> ListaObjetos = new List<ObjetoCiudadano>();

            ListaObjetos = (IEnumerable<ObjetoCiudadano>)(
                    from ciudadanos in _context.Ciudadanos
                    join colonias in _context.Colonias on ciudadanos.ColoniaId equals colonias.ColoniaId
                    join calles in _context.Calles on ciudadanos.CalleId equals calles.CalleId
                    //join municipios in _context.Municipios on ciudadanos.MunicipioId equals municipios.MunicipioId

                    where true && String.IsNullOrEmpty(Nombre) ? (true) : ciudadanos.NombreCompleto.Contains(Nombre)
                    where true && (MesCumple == 0) ? (true) : ((DateTime)ciudadanos.FechaNacimiento).Month == MesCumple
                    where true && String.IsNullOrEmpty(Colonia) ? (true) : colonias.NombreColonia.Contains(Colonia)
                    where true && String.IsNullOrEmpty(Calle) ? (true) : calles.NombreCalle.Contains(Calle)
                    where true && (Municipio <= 0) ? (true) : ciudadanos.MunicipioId == Municipio

                    where true && (CP == 0) ? (true) : ciudadanos.Cp == CP
                    where true && String.IsNullOrEmpty(Email) ? (true) : ciudadanos.Email.Contains(Email)
                    where true && String.IsNullOrEmpty(Telefono) ? (true) : ciudadanos.Telefono.Contains(Telefono)
                    where true && String.IsNullOrEmpty(Genero) ? (true) : ciudadanos.Genero.Contains(Genero)
                    where true && (cumple == -1) ? (true) : ciudadanos.recordarcumple  == cumple
                    where true && (BpartidoId <= 0) ? (true) : ciudadanos.PartidoId == BpartidoId
                    where true && (Bafin <= 0) ? (true) : ciudadanos.Afin == Bafin
                    where true && (BrCasilla <= 0) ? (true) : ciudadanos.RCasilla == BrCasilla
                    where true && (BlNegra <= 0) ? (true) : ciudadanos.NoAfin == BlNegra
                    where true && (BdDigital <= 0) ? (true) : ciudadanos.DDigital == BdDigital
                    where true && (Blider <= 0) ? (true) : _context.IntegrantesAsociacions.Where(a=>a.Representante==1).Select(a=>a.CiudadanoId).Contains(ciudadanos.CiudadanoId)

                    orderby ciudadanos.Paterno ascending

                    select new ObjetoCiudadano
                    {
                        CiudadanoID = ciudadanos.CiudadanoId,
                        RFC = ciudadanos.RFC??"",
                        Paterno = ciudadanos.Paterno,
                        Materno = ciudadanos.Materno,
                        Nombre = ciudadanos.Nombre,
                        NombreCompleto = ciudadanos.NombreCompleto,
                        Genero = ciudadanos.Genero,
                        Colonia = colonias.NombreColonia,
                        Calle = calles.NombreCalle,
                        ColoniaID = (int)ciudadanos.ColoniaId,
                        CalleID = (int)ciudadanos.CalleId,
                        CP = (int)ciudadanos.Cp,
                        NumeroExterior = ciudadanos.NumExterior ?? "",
                        NumeroInterior = ciudadanos.NumInterior ?? "",
                        FechaNacimiento = (DateTime) (ciudadanos.FechaNacimiento?? DateTime.Parse("1900-01-01 00:00:00.000")), 
                        recordarCumple = (int) ciudadanos.recordarcumple,
                        Email = ciudadanos.Email ?? "",
                        Telefono = ciudadanos.Telefono
                    }).Skip(offsetPeticiones).Take(RegXpag);
            return ListaObjetos;
        }

        /************************************************************
            Obtiene Número de Registros aplicando FILTRO
        *************************************************************/
        public int ObtieneCiudadanosXfiltro(string Nombre, int MesCumple, string Colonia, string Calle, int CP, string Email, string Telefono, string Genero, int cumple, int Municipio, int BpartidoId, int Blider, int Bafin, int BrCasilla, int BlNegra, int BdDigital)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            var results =
                    from ciudadanos in _context.Ciudadanos
                    join colonias in _context.Colonias on ciudadanos.ColoniaId equals colonias.ColoniaId
                    join calles in _context.Calles on ciudadanos.CalleId equals calles.CalleId
                    //join municipios in _context.Municipios on ciudadanos.MunicipioId equals municipios.MunicipioId

                    where true && String.IsNullOrEmpty(Nombre) ? (true) : ciudadanos.NombreCompleto.Contains(Nombre)
                    where true && (MesCumple == 0) ? (true) : ((DateTime)ciudadanos.FechaNacimiento).Month == MesCumple
                    where true && String.IsNullOrEmpty(Colonia) ? (true) : colonias.NombreColonia.Contains(Colonia)
                    where true && String.IsNullOrEmpty(Calle) ? (true) : calles.NombreCalle.Contains(Calle)
                    //where true && String.IsNullOrEmpty(Municipio) ? (true) : municipios.Nombre.Contains(Municipio)
                    where true && (Municipio <= 0) ? (true) : ciudadanos.MunicipioId == Municipio
                    where true && (CP == 0) ? (true) : ciudadanos.Cp == CP
                    where true && String.IsNullOrEmpty(Email) ? (true) : ciudadanos.Email.Contains(Email)
                    where true && String.IsNullOrEmpty(Telefono) ? (true) : ciudadanos.Telefono.Contains(Telefono)
                    where true && String.IsNullOrEmpty(Genero) ? (true) : ciudadanos.Genero.Contains(Genero)
                    where true && (cumple == -1) ? (true) : ciudadanos.recordarcumple == cumple
                    where true && (BpartidoId <= 0) ? (true) : ciudadanos.PartidoId == BpartidoId
                    where true && (Bafin <= 0) ? (true) : ciudadanos.Afin == Bafin
                    where true && (BrCasilla <= 0) ? (true) : ciudadanos.RCasilla == BrCasilla
                    where true && (BlNegra <= 0) ? (true) : ciudadanos.NoAfin == BlNegra
                    where true && (BdDigital <= 0) ? (true) : ciudadanos.DDigital == BdDigital
                    where true && (Blider <= 0) ? (true) : _context.IntegrantesAsociacions.Where(a => a.Representante == 1).Select(a => a.CiudadanoId).Contains(ciudadanos.CiudadanoId)

                    select ciudadanos.CiudadanoId;

            return results.Count();
        }

        /*******************************************************************
            Obtiene el número de Ciudadanos
        ********************************************************************/
        public Int32 numeroCiudadanos()
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Ciudadanos] WHERE Estatus=1";
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }


        /****************************************************************************
                    Subir FOTO de Ciudadano
        *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirFotoCiudadano(List<IFormFile> files, int CiudadanoId)
        {

            var URL = "";
            bool isSuccess = false;
            string serverMessage;
            string nombreArchivoBD;
            string nombreArchivo;
            string extensionArchivo;
            string filePath;
            int posicionPunto;
            foreach (IFormFile item in files)
            {
                if (item.Length > 0)
                {
                    nombreArchivo = item.FileName;
                    posicionPunto = item.FileName.IndexOf(".");
                    extensionArchivo = item.FileName.Substring(posicionPunto + 1);

                    nombreArchivoBD = "FOTO_" + Convert.ToString(CiudadanoId) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\CIUDADANOS\", nombreArchivoBD);

                    FileInfo fi = new FileInfo(filePath);

                    try
                    {
                        if (fi.Exists)
                        {
                            fi.Delete();
                        }
                    }
                    catch (Exception e)
                    {
                        ViewBag.EstatusError = "Si el archivo está abierto, debe cerrarse";
                        View("Error");
                    }

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            item.CopyTo(stream);
                        }
                            URL = "/Archivos/PETICIONES/CIUDADANOS/" + nombreArchivoBD;

                        GuardaReferenciaFotoCiudadanoBD(nombreArchivo, nombreArchivoBD, URL, CiudadanoId);

                    }
                    catch
                    {
                        isSuccess = false;
                    }

                }
            }


            if (isSuccess)
            {
                isSuccess = true;
                serverMessage = "Los archivos han sido subidos";
            }
            else
            {
                isSuccess = false;

                serverMessage = "No fue posible subir los archivos";
            }
            return Json(new { IsSucccess = isSuccess, ServerMessage = URL });
        }

        /****************************************************************************
            Guarda Referencia de Archivo de FOTO del Ciudadano
        *****************************************************************************/
        public string GuardaReferenciaFotoCiudadanoBD(string NombreArchivo, string NombreArchivoBD, string URL, int CiudadanoId)
        {
            var result = _context.Ciudadanos.SingleOrDefault(c => c.CiudadanoId == CiudadanoId);
            if (result != null)
            {
                result.NombreArchivoBD = NombreArchivoBD;
                result.URL = URL;
                _context.Ciudadanos.Update(result);
                _context.SaveChanges();
                return "OK";
            }
            else{
                return "NO";
            }
        }


        /****************************************************************************
                    Subir INE de Ciudadano
        *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirINECiudadano(List<IFormFile> files, int CiudadanoId)
        {
            var URL = "";
            bool isSuccess = false;
            string serverMessage;
            string nombreArchivoBD;
            string nombreArchivo;
            string extensionArchivo;
            string filePath;
            int posicionPunto;
            foreach (IFormFile item in files)
            {
                if (item.Length > 0)
                {
                    nombreArchivo = item.FileName;
                    posicionPunto = item.FileName.IndexOf(".");
                    extensionArchivo = item.FileName.Substring(posicionPunto + 1);

                    nombreArchivoBD = "INE_" + Convert.ToString(CiudadanoId) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\CIUDADANOS\", nombreArchivoBD);

                    FileInfo fi = new FileInfo(filePath);

                    try
                    {
                        if (fi.Exists)
                        {
                            fi.Delete();
                        }
                    }
                    catch (Exception e)
                    {
                        ViewBag.EstatusError = "Si el archivo está abierto, debe cerrarse";
                        View("Error");
                    }

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            item.CopyTo(stream);
                        }
                        URL = "/Archivos/PETICIONES/CIUDADANOS/" + nombreArchivoBD;

                        GuardaReferenciaINECiudadanoBD(nombreArchivo, nombreArchivoBD, URL, CiudadanoId);

                    }
                    catch
                    {
                        isSuccess = false;
                    }

                }
            }


            if (isSuccess)
            {
                isSuccess = true;
                serverMessage = "Los archivos han sido subidos";
            }
            else
            {
                isSuccess = false;

                serverMessage = "No fue posible subir los archivos";
            }
            return Json(new { IsSucccess = isSuccess, ServerMessage = URL });
        }

        /****************************************************************************
            Guarda Referencia de Archivo de INE del Ciudadano
        *****************************************************************************/
        public string GuardaReferenciaINECiudadanoBD(string NombreArchivo, string NombreArchivoBD, string URL, int CiudadanoId)
        {

            var result = _context.Ciudadanos.SingleOrDefault(c => c.CiudadanoId == CiudadanoId);
            if (result != null)
            {
                result.ArchivoINE_BD = NombreArchivoBD;
                result.INE_URL = URL;
                _context.Ciudadanos.Update(result);
                _context.SaveChanges();
                return "OK";
            }
            else
            {
                return "NO";
            }
        }


        /************************************************************ 
            Obtiene Detalle de CIUDADANO
        *************************************************************/
        public IEnumerable<ObjetoCiudadano> ObtieneDetalleCiudadanos(int idCiudadano)
        {
            IEnumerable<ObjetoCiudadano> ListaObjetos = new List<ObjetoCiudadano>();
            ListaObjetos = (IEnumerable<ObjetoCiudadano>)(
                    from ciudadano in _context.Ciudadanos.Where(c => c.CiudadanoId == idCiudadano)
                    join colonia in _context.Colonias on ciudadano.ColoniaId equals colonia.ColoniaId
                    join calle in _context.Calles on ciudadano.CalleId equals calle.CalleId
                    select new ObjetoCiudadano
                    {
                        CiudadanoID = ciudadano.CiudadanoId,
                        Paterno = ciudadano.Paterno,
                        Materno = ciudadano.Materno,
                        Nombre = ciudadano.Nombre,
                        FechaNacimiento = (DateTime)ciudadano.FechaNacimiento,
                        Genero = ciudadano.Genero, 
                        recordarCumple = (int)ciudadano.recordarcumple,
                        Colonia = colonia.NombreColonia ?? "",
                        Calle = calle.NombreCalle ?? "",
                        Municipio = _context.Municipios.Where(m=>m.MunicipioId == ciudadano.MunicipioId).Select(m=>m.Nombre).FirstOrDefault()??"",
                        ColoniaID = (int)ciudadano.ColoniaId,
                        CalleID = (int)ciudadano.CalleId,
                        NumeroExterior = ciudadano.NumExterior ?? "",
                        NumeroInterior = ciudadano.NumInterior ?? "",
                        CP = (int)ciudadano.Cp,
                        Email = ciudadano.Email ?? "",
                        Telefono = ciudadano.Telefono ?? "",
                        Notas = ciudadano.Notas ?? "",
                        RFC = ciudadano.RFC ?? "",
                        URL = ciudadano.URL ?? "",
                        Partido = _context.CatPartidos.Where(p=>p.PartidoId==ciudadano.PartidoId).Select(p=>p.Nombre).FirstOrDefault() ?? "",
                        LogoPartido = _context.CatPartidos.Where(p => p.PartidoId == ciudadano.PartidoId).Select(p => p.Logotipo).FirstOrDefault() ?? "",
                        TipoMiembro = ciudadano.TipoMiembro ?? "",
                        Seccion = ciudadano.Seccion ?? "",
                        Latitud = ciudadano.Latitud ?? "",
                        Longitud = ciudadano.Longitud ?? "",
                        CURP = ciudadano.CURP ?? "",
                        Afin = (int)ciudadano.Afin,
                        Rcasilla = (int)ciudadano.RCasilla,
                        Noafin = (int)ciudadano.NoAfin,
                        DDigital = (int)ciudadano.DDigital
                        
                    });
            return ListaObjetos;
        }

        /****************************************************************************
            PETICIÓN - Obtiene Beneficios X Ciudadano
        *****************************************************************************/
        [HttpGet]
        public List<ObjBeneficosXciudadano> ObtieneBeneficiosXciudadano(int idCiudadano)
        {
            List<ObjBeneficosXciudadano> ListaObjetos = new List<ObjBeneficosXciudadano>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneBeneficiosXciudadano";
            cmd.Parameters.Add("@CiudadanoID", System.Data.SqlDbType.Int).Value = idCiudadano;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjBeneficosXciudadano obj = new ObjBeneficosXciudadano();
                    obj.PeticionId = query.GetInt32(0);
                    obj.Folio = query.GetString(1);
                    obj.Descripcion = query.GetString(2);
                    obj.EstatusId = query.GetInt32(3);
                    obj.Estatus = query.GetString(4);
                    obj.FechaSolicitud = query.GetDateTime(5);
                    obj.FechaConclusion = query.GetDateTime(6);
                    obj.Notas = query.GetString(7);
                    obj.Hito = query.GetInt32(8);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /****************************************************************************
            GESTIÓN - Obtiene Beneficios X Ciudadano
        *****************************************************************************/
        [HttpGet]
        public List<ObjBeneficosXciudadanoGestion> ObtieneBeneficiosXciudadano_Gestion(int idCiudadano)
        {
            List<ObjBeneficosXciudadanoGestion> ListaObjetos = new List<ObjBeneficosXciudadanoGestion>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneBeneficiosXciudadano_Gestion";
            cmd.Parameters.Add("@CiudadanoID", System.Data.SqlDbType.Int).Value = idCiudadano;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjBeneficosXciudadanoGestion obj = new ObjBeneficosXciudadanoGestion();
                    obj.GestionId = query.GetInt32(0);
                    obj.Folio = query.GetString(1);
                    obj.Descripcion = query.GetString(2);
                    obj.EstatusId = query.GetInt32(3);
                    obj.Estatus = query.GetString(4);
                    obj.FechaSolicitud = query.GetDateTime(5);
                    obj.FechaConclusion = query.GetDateTime(6);
                    obj.Notas = query.GetString(7);
                    obj.Hito = query.GetInt32(8);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /****************************************************************************
            Obtiene Asistencia a Evento X Ciudadano
        *****************************************************************************/
        [HttpGet]
        public List<ObjAsisEventoXciudadano> ObtieneAsisEventoXciudadano(int idCiudadano)
        {
            List<ObjAsisEventoXciudadano> ListaObjetos = new List<ObjAsisEventoXciudadano>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneAsistenciaEventoXciudadano";
            cmd.Parameters.Add("@CiudadanoID", System.Data.SqlDbType.Int).Value = idCiudadano;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjAsisEventoXciudadano obj = new ObjAsisEventoXciudadano();
                    obj.EventoId = query.GetInt32(0);
                    obj.Folio = query.GetString(1);
                    obj.NombreEvento = query.GetString(2);
                    obj.FechaEvento = query.GetDateTime(3);
                    obj.TipoEvento = query.GetString(4);
                    obj.Asistencia = query.GetInt32(5);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
            Obtiene Cumpleaños del Mes
        *****************************************************************************/
        [HttpGet]
        public List<ObjCumples> ObtieneCumplesXmes(int mesNum)
        {
            List<ObjCumples> ListaObjetos = new List<ObjCumples>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneCumplesXmes";
            cmd.Parameters.Add("@Mes", System.Data.SqlDbType.Int).Value = mesNum;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var momento = DateTime.Now;
            int dia = (int)momento.Day;
            int mes = momento.Month;

            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjCumples obj = new ObjCumples();
                    obj.DiaNumero = query.GetInt32(2);
                    if( dia == obj.DiaNumero && mes == mesNum)
                    {
                        obj.hoy = 1;
                    }
                    else
                    {
                        obj.hoy = 0;
                    }
                    
                    obj.CiudadanoID = query.GetInt32(0);
                    obj.DiaNombre = query.GetString(5);
                    obj.Nombre = query.GetString(3);
                    obj.Asociacion = query.GetString(7);
                    obj.Puesto = query.GetString(8);
                    obj.urlFoto = query.GetString(9);
                    obj.Telefono = query.GetString(10);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /*******************************************************************
            Obtiene Asociaciones a las que pertenece un Ciudadano
        ********************************************************************/
        public IEnumerable<ObjAsociacionPersona> ObtieneAsociacionesParticipa(int idCiudadano)
        {

            List<ObjAsociacionPersona> ListaObjetos = new List<ObjAsociacionPersona>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            //SqlCommand cmd = conn.CreateCommand();

            conn.Open();

            string stm = "SELECT C.CiudadanoID, c.Nombre, A.Nombre, IA.Puesto, IA.Representante, A.AsociacionId " +
                        " FROM IntegrantesAsociacion AS IA " +
                        " LEFT JOIN Asociaciones AS A ON A.AsociacionID = IA.AsociacionID " +
                        " LEFT JOIN Ciudadanos as c on c.CiudadanoID = ia.CiudadanoID " +
                        " WHERE C.CiudadanoID = " + idCiudadano;

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjAsociacionPersona obj = new ObjAsociacionPersona();
                    obj.Nombre = query.GetString(2);
                    obj.Puesto = query.GetString(3);
                    obj.Representante = query.GetInt32(4);
                    obj.AsociacionId = query.GetInt32(5);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /******************************************************************************
         * Lee datos en una Tabla, para guardarlos en EXCEL
         ******************************************************************************/

        public DataTable ObtieneDatosReporteExcelList_Ciudadanos_Asociacion()
        {
            int LegislaturaId = 2;
            int DiputaoId = 8;
            DataTable dt = new DataTable();
            dt.TableName = "Ciudadanos_Asociación";

            dt.Columns.Add("CiudadanosID", typeof(int));                    // 0
            dt.Columns.Add("Paterno", typeof(string));                      // 1
            dt.Columns.Add("Materno", typeof(string));                      // 2
            dt.Columns.Add("Nombres", typeof(string));                      // 3    
            dt.Columns.Add("NombreCompleto", typeof(string));               // 4
            dt.Columns.Add("Colonia", typeof(string));                      // 5
            dt.Columns.Add("Calle", typeof(string));                        // 6    
            dt.Columns.Add("NúmExterior", typeof(string));                  // 7    
            dt.Columns.Add("NúmInterior", typeof(string));                  // 8
            dt.Columns.Add("CP", typeof(int));                           // 9    
            dt.Columns.Add("Municipio", typeof(string));                    // 10
            dt.Columns.Add("email", typeof(string));                        // 11
            dt.Columns.Add("Teléfono", typeof(string));                     // 12
            dt.Columns.Add("MesNacimiento", typeof(int));                   // 13
            dt.Columns.Add("DiaNacimiento", typeof(int));                   // 14
            dt.Columns.Add("Partido", typeof(string));                      // 15
            dt.Columns.Add("TipoMiembro", typeof(string));                  // 16
            dt.Columns.Add("Seccion", typeof(string));                      // 17
            dt.Columns.Add("Género", typeof(string));                       // 18
            dt.Columns.Add("Notas", typeof(string));                        // 19
            dt.Columns.Add("Latitud", typeof(string));                      // 20
            dt.Columns.Add("Longitud", typeof(string));                     // 21
            dt.Columns.Add("FechaRegistro", typeof(DateTime));              // 22
            dt.Columns.Add("RecordarCumpleaños", typeof(string));           // 23
            dt.Columns.Add("RFC", typeof(string));                          // 24
            dt.Columns.Add("CURP", typeof(string));                         // 25
            dt.Columns.Add("Fotografía", typeof(string));                   // 26
            dt.Columns.Add("INE", typeof(string));                          // 27
            dt.Columns.Add("Afin", typeof(string));                         // 28
            dt.Columns.Add("RCasilla", typeof(string));                     // 29
            dt.Columns.Add("LNegra", typeof(string));                       // 30
            dt.Columns.Add("DDigital", typeof(string));                     // 31    
            dt.Columns.Add("NombreAsociación", typeof(string));             // 32
            dt.Columns.Add("Puesto", typeof(string));                      // 33
            dt.Columns.Add("Representante", typeof(string));                        // 34

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpCiudadanos_Excel";
            cmd.Parameters.Add("@LegislaturaID", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@DiputadoID", System.Data.SqlDbType.Int).Value = DiputaoId;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    dt.Rows.Add(
                        query.GetInt32(0),         // CiudadanosID
                        query.GetString(1),         // Paterno
                        query.GetString(2),         // Materno
                        query.GetString(3),         // Nombres
                        query.GetString(4),         // NombreCompleto
                        query.GetString(5),         // Colonia
                        query.GetString(6),         // Calle
                        query.GetString(7),         // NúmExterior
                        query.GetString(8),         // NúmInterior
                        query.GetInt32(9),        // CP
                        query.GetString(10),        // Municipio
                        query.GetString(11),        // email
                        query.GetString(12),        // Teléfono
                        query.GetInt32(13),         // MesNacimiento
                        query.GetInt32(14),         // DiaNacimiento
                        query.GetString(15),         // Partido
                        query.GetString(16),         // TipoMiembro
                        query.GetString(17),         // Seccion
                        query.GetString(18),         // Género
                        query.GetString(19),        // Notas
                        query.GetString(20),         // Latitud
                        query.GetString(21),         // Longitud
                        query.GetDateTime(22),       // FechaRegistro
                        query.GetString(23),         // RecordarCumpleaños
                        query.GetString(24),         // RFC
                        query.GetString(25),         // CURP
                        query.GetString(26),         // Fotografía
                        query.GetString(27),         // INE
                        query.GetString(28),         // Afin
                        query.GetString(29),        // RCasilla
                        query.GetString(30),         // LNegra
                        query.GetString(31),         // DDigital
                        query.GetString(32),         // NombreAsociación
                        query.GetString(33),        // Puesto
                        query.GetString(34)          // Representante
                    );
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return dt;
        }


        /******************************************************************************
         * Lee datos en una Tabla, para guardarlos en EXCEL
         ******************************************************************************/

        public DataTable ObtieneDatosReporteExcelList_Ciudadanos()
        {
            int LegislaturaId = 2;
            int DiputaoId = 8;
            DataTable dt = new DataTable();
            dt.TableName = "Ciudadanos";

            dt.Columns.Add("CiudadanosID", typeof(int));                    // 0
            dt.Columns.Add("Paterno", typeof(string));                      // 1
            dt.Columns.Add("Materno", typeof(string));                      // 2
            dt.Columns.Add("Nombres", typeof(string));                      // 3    
            dt.Columns.Add("NombreCompleto", typeof(string));               // 4
            dt.Columns.Add("Colonia", typeof(string));                      // 5
            dt.Columns.Add("Calle", typeof(string));                        // 6    
            dt.Columns.Add("NúmExterior", typeof(string));                  // 7    
            dt.Columns.Add("NúmInterior", typeof(string));                  // 8
            dt.Columns.Add("CP", typeof(int));                           // 9    
            dt.Columns.Add("Municipio", typeof(string));                    // 10
            dt.Columns.Add("email", typeof(string));                        // 11
            dt.Columns.Add("Teléfono", typeof(string));                     // 12
            dt.Columns.Add("MesNacimiento", typeof(int));                   // 13
            dt.Columns.Add("DiaNacimiento", typeof(int));                   // 14
            dt.Columns.Add("Partido", typeof(string));                      // 15
            dt.Columns.Add("TipoMiembro", typeof(string));                  // 16
            dt.Columns.Add("Seccion", typeof(string));                      // 17
            dt.Columns.Add("Género", typeof(string));                       // 18
            dt.Columns.Add("Notas", typeof(string));                        // 19
            dt.Columns.Add("Latitud", typeof(string));                      // 20
            dt.Columns.Add("Longitud", typeof(string));                     // 21
            dt.Columns.Add("FechaRegistro", typeof(DateTime));              // 22
            dt.Columns.Add("RecordarCumpleaños", typeof(string));           // 23
            dt.Columns.Add("RFC", typeof(string));                          // 24
            dt.Columns.Add("CURP", typeof(string));                         // 25
            dt.Columns.Add("Fotografía", typeof(string));                   // 26
            dt.Columns.Add("INE", typeof(string));                          // 27
            dt.Columns.Add("Afin", typeof(string));                         // 28
            dt.Columns.Add("RCasilla", typeof(string));                     // 29
            dt.Columns.Add("LNegra", typeof(string));                       // 30
            dt.Columns.Add("DDigital", typeof(string));                     // 31    

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpCiudadanosSolos_Excel";
            cmd.Parameters.Add("@LegislaturaID", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@DiputadoID", System.Data.SqlDbType.Int).Value = DiputaoId;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    dt.Rows.Add(
                        query.GetInt32(0),         // CiudadanosID
                        query.GetString(1),         // Paterno
                        query.GetString(2),         // Materno
                        query.GetString(3),         // Nombres
                        query.GetString(4),         // NombreCompleto
                        query.GetString(5),         // Colonia
                        query.GetString(6),         // Calle
                        query.GetString(7),         // NúmExterior
                        query.GetString(8),         // NúmInterior
                        query.GetInt32(9),        // CP
                        query.GetString(10),        // Municipio
                        query.GetString(11),        // email
                        query.GetString(12),        // Teléfono
                        query.GetInt32(13),         // MesNacimiento
                        query.GetInt32(14),         // DiaNacimiento
                        query.GetString(15),         // Partido
                        query.GetString(16),         // TipoMiembro
                        query.GetString(17),         // Seccion
                        query.GetString(18),         // Género
                        query.GetString(19),        // Notas
                        query.GetString(20),         // Latitud
                        query.GetString(21),         // Longitud
                        query.GetDateTime(22),       // FechaRegistro
                        query.GetString(23),         // RecordarCumpleaños
                        query.GetString(24),         // RFC
                        query.GetString(25),         // CURP
                        query.GetString(26),         // Fotografía
                        query.GetString(27),         // INE
                        query.GetString(28),         // Afin
                        query.GetString(29),        // RCasilla
                        query.GetString(30),         // LNegra
                        query.GetString(31)         // DDigital
                    );
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return dt;
        }

        /***********************************************************************
         *  Excel
         ***********************************************************************/
        public ActionResult WriteDataToExcel()
        {
            DataTable dt = this.ObtieneDatosReporteExcelList_Ciudadanos_Asociacion();
            DataTable dt_Solo_Ciudadanos = this.ObtieneDatosReporteExcelList_Ciudadanos();
            string fileName = "Ciudadanos.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                wb.Worksheets.Add(dt_Solo_Ciudadanos);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }


        /******************************************************************************
         * Asistentes a Evento los guarda en EXCEL
         ******************************************************************************/
        public DataTable ObtieneAsistentesAevento(int eventoId)
        {
            int LegislaturaId = 2;
            int DiputaoId = 8;
            DataTable dt = new DataTable();
            dt.TableName = "Asistentes a Evento";

            dt.Columns.Add("CiudadanosID", typeof(int));                    // 0
            dt.Columns.Add("Paterno", typeof(string));                      // 1
            dt.Columns.Add("Materno", typeof(string));                      // 2
            dt.Columns.Add("Nombres", typeof(string));                      // 3    
            dt.Columns.Add("NombreCompleto", typeof(string));               // 4

            dt.Columns.Add("Asistencia", typeof(string));               // 32
            dt.Columns.Add("Comentario", typeof(string));               // 33

            dt.Columns.Add("Colonia", typeof(string));                      // 5
            dt.Columns.Add("Calle", typeof(string));                        // 6    
            dt.Columns.Add("NúmExterior", typeof(string));                  // 7    
            dt.Columns.Add("NúmInterior", typeof(string));                  // 8
            dt.Columns.Add("CP", typeof(int));                           // 9    
            dt.Columns.Add("Municipio", typeof(string));                    // 10
            dt.Columns.Add("email", typeof(string));                        // 11
            dt.Columns.Add("Teléfono", typeof(string));                     // 12
            dt.Columns.Add("MesNacimiento", typeof(int));                   // 13
            dt.Columns.Add("DiaNacimiento", typeof(int));                   // 14
            dt.Columns.Add("Partido", typeof(string));                      // 15
            dt.Columns.Add("TipoMiembro", typeof(string));                  // 16
            dt.Columns.Add("Seccion", typeof(string));                      // 17
            dt.Columns.Add("Género", typeof(string));                       // 18
            dt.Columns.Add("Notas", typeof(string));                        // 19
            dt.Columns.Add("Latitud", typeof(string));                      // 20
            dt.Columns.Add("Longitud", typeof(string));                     // 21
            dt.Columns.Add("FechaRegistro", typeof(DateTime));              // 22
            dt.Columns.Add("RecordarCumpleaños", typeof(string));           // 23
            dt.Columns.Add("RFC", typeof(string));                          // 24
            dt.Columns.Add("CURP", typeof(string));                         // 25
            dt.Columns.Add("Fotografía", typeof(string));                   // 26
            dt.Columns.Add("INE", typeof(string));                          // 27
            dt.Columns.Add("Afin", typeof(string));                         // 28
            dt.Columns.Add("RCasilla", typeof(string));                     // 29
            dt.Columns.Add("LNegra", typeof(string));                       // 30
            dt.Columns.Add("DDigital", typeof(string));                     // 31    

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAsistentesEvento_Excel";
            cmd.Parameters.Add("@LegislaturaID", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@DiputadoID", System.Data.SqlDbType.Int).Value = DiputaoId;
            cmd.Parameters.Add("@EventoID", System.Data.SqlDbType.Int).Value = eventoId;
            
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    dt.Rows.Add(
                        query.GetInt32(0),         // CiudadanosID
                        query.GetString(1),         // Paterno
                        query.GetString(2),         // Materno
                        query.GetString(3),         // Nombres
                        query.GetString(4),         // NombreCompleto

                        query.GetString(32),         // Asistencia
                        query.GetString(33),         // Comentario

                        query.GetString(5),         // Colonia
                        query.GetString(6),         // Calle
                        query.GetString(7),         // NúmExterior
                        query.GetString(8),         // NúmInterior
                        query.GetInt32(9),        // CP
                        query.GetString(10),        // Municipio
                        query.GetString(11),        // email
                        query.GetString(12),        // Teléfono
                        query.GetInt32(13),         // MesNacimiento
                        query.GetInt32(14),         // DiaNacimiento
                        query.GetString(15),         // Partido
                        query.GetString(16),         // TipoMiembro
                        query.GetString(17),         // Seccion
                        query.GetString(18),         // Género
                        query.GetString(19),        // Notas
                        query.GetString(20),         // Latitud
                        query.GetString(21),         // Longitud
                        query.GetDateTime(22),       // FechaRegistro
                        query.GetString(23),         // RecordarCumpleaños
                        query.GetString(24),         // RFC
                        query.GetString(25),         // CURP
                        query.GetString(26),         // Fotografía
                        query.GetString(27),         // INE
                        query.GetString(28),         // Afin
                        query.GetString(29),        // RCasilla
                        query.GetString(30),         // LNegra
                        query.GetString(31)         // DDigital
                    );
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return dt;
        }

        /***********************************************************************
         *  Excel Lista Asistentes a Evento
         ***********************************************************************/
        public ActionResult AsistentesEventoToExcel(int id)
        {
            Console.WriteLine("Parametro - eventoId:" + id);
            DataTable dt = this.ObtieneAsistentesAevento(id);
            string fileName = "AsistenteEvento.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        /********************************************************************
               O B J E T O S
         *********************************************************************/
        public partial class ObjBeneficosXciudadano
        {
            public int PeticionId { get; set; }
            public string Folio { get; set; }
            public string Descripcion { get; set; }
            public int EstatusId { get; set; }
            public string Estatus { get; set; }
            public DateTime? FechaSolicitud { get; set; }
            public DateTime? FechaConclusion { get; set; }
            public string Notas { get; set; }
            public int? Hito { get; set; }
        }

        public partial class ObjBeneficosXciudadanoGestion
        {
            public int GestionId { get; set; }
            public string? Folio { get; set; }
            public string Descripcion { get; set; }
            public int EstatusId { get; set; }
            public string Estatus { get; set; }
            public DateTime? FechaSolicitud { get; set; }
            public DateTime? FechaConclusion { get; set; }
            public string Notas { get; set; }
            public int? Hito { get; set; }
        }
        public partial class ObjAsisEventoXciudadano
        {
            public int EventoId { get; set; }
            public string Folio { get; set; }
            public string NombreEvento { get; set; }
            public string TipoEvento { get; set; }
            public DateTime? FechaEvento { get; set; }
            public int? Asistencia { get; set; }
        }

        public partial class ObjCumples
        {
            public int CiudadanoID { get; set; }
            public int DiaNumero { get; set; }
            public int hoy { get; set; }
            public string? DiaNombre { get; set; }
            public string Nombre { get; set; }
            public string urlFoto { get; set; }
            public string? Asociacion { get; set; }
            public string Puesto { get; set; }
            public string Telefono { get; set; }
        }

        public partial class ObjAsociacionPersona
        {
            public string Nombre { get; set; }
            public string Puesto { get; set; }
            public int Representante { get; set; }
            public int AsociacionId { get; set; }
        }

    }
}
